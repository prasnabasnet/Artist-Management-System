import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from apps.users.models.music import Music, GenreChoices
from django.db.models import Q
from apps.users.models.artist import Artist

GenreEnum = graphene.Enum.from_enum(GenreChoices)

class MusicType(DjangoObjectType):
    class Meta:
        model = Music
        fields = "__all__"

    genre = graphene.String()

    def resolve_genre(self, info):
        return self.genre

class PaginatedMusicType(graphene.ObjectType):
    total_rows = graphene.Int()
    rows = graphene.List(MusicType)

class Query(graphene.ObjectType):
    all_music = graphene.Field(
        PaginatedMusicType,
        search=graphene.String(),
        first=graphene.Int(),
        skip=graphene.Int(),
    )

    music_by_id = graphene.Field(
        MusicType,
        id=graphene.Int(required=True),
    )

    my_music = graphene.Field(          
        PaginatedMusicType,
        first=graphene.Int(),
        skip=graphene.Int(),
    )

    @login_required
    def resolve_all_music(self, info, search=None, first=None, skip=0):
        filters = Q(is_active=True)

        if search:
            filters &= (
                Q(title__icontains=search)
                | Q(album_name__icontains=search)
                | Q(artist__name__icontains=search)
                | Q(genre__icontains=search)
            )

        queryset = Music.objects.filter(filters).order_by("-created_at")
        total_count = queryset.count()
        paginated = queryset[skip: skip + first] if first is not None else queryset[skip:]

        return PaginatedMusicType(total_rows=total_count, rows=list(paginated))

    @login_required
    def resolve_music_by_id(self, info, id):
        try:
            return Music.objects.get(id=id, is_active=True)
        except Music.DoesNotExist:
            raise Exception("Music not found")

    @login_required
    def resolve_my_music(self, info, first=None, skip=0):   
        user = info.context.user
        if not user.is_artist:
            raise Exception("Only artists can access this.")
        try:
            artist = user.artist_profile
        except Exception:
            raise Exception("No artist profile linked to this account.")

        queryset = Music.objects.filter(
            artist=artist, is_active=True
        ).order_by("-created_at")

        total_count = queryset.count()
        paginated = queryset[skip: skip + first] if first is not None else queryset[skip:]

        return PaginatedMusicType(total_rows=total_count, rows=list(paginated))


class MusicInput(graphene.InputObjectType):
    artist_id = graphene.ID(required=True)
    title = graphene.String(required=True)
    album_name = graphene.String(required=True)
    genre = GenreEnum(required=True)


def _require_can_manage_music(user):
    if not (user.is_super_admin or user.is_artist_manager):
        raise Exception("You do not have permission to manage music.")


class CreateMusic(graphene.Mutation):
    class Arguments:
        input = MusicInput(required=True)

    music = graphene.Field(MusicType)
    message = graphene.String()

    @login_required
    def mutate(self, info, input):
        _require_can_manage_music(info.context.user)
        try:
            artist = Artist.objects.get(id=input.artist_id, is_active=True)
        except Artist.DoesNotExist:
            raise Exception("Artist not found")

        music = Music.objects.create(
            artist=artist,
            title=input.title,
            album_name=input.album_name,
            genre=input.genre.value if hasattr(input.genre, "value") else input.genre,
        )
        return CreateMusic(music=music, message="Music created successfully")


class UpdateMusic(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = MusicInput(required=True)

    music = graphene.Field(MusicType)
    message = graphene.String()

    @login_required
    def mutate(self, info, id, input):
        _require_can_manage_music(info.context.user)
        try:
            music = Music.objects.get(id=id, is_active=True)
        except Music.DoesNotExist:
            raise Exception("Music not found")

        try:
            artist = Artist.objects.get(id=input.artist_id, is_active=True)
        except Artist.DoesNotExist:
            raise Exception("Artist not found")

        music.artist = artist
        music.title = input.title
        music.album_name = input.album_name
        music.genre = input.genre.value if hasattr(input.genre, "value") else input.genre
        music.save()

        return UpdateMusic(music=music, message="Music updated successfully")


class DeleteMusic(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    message = graphene.String()

    @login_required
    def mutate(self, info, id):
        _require_can_manage_music(info.context.user)
        try:
            music = Music.objects.get(id=id, is_active=True)
        except Music.DoesNotExist:
            raise Exception("Music not found")

        music.is_active = False
        music.save()
        return DeleteMusic(message="Music deleted successfully")


class Mutation(graphene.ObjectType):
    create_music = CreateMusic.Field()
    update_music = UpdateMusic.Field()
    delete_music = DeleteMusic.Field()


music_schema = graphene.Schema(query=Query, mutation=Mutation)