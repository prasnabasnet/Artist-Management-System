import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from apps.users.models.artist import Artist, GenderChoices
from apps.users.models.user import RoleChoices
from django.db.models import Q

GenderEnum = graphene.Enum.from_enum(GenderChoices)


class ArtistType(DjangoObjectType):
    class Meta:
        model = Artist
        fields = "__all__"

    gender = graphene.String()

    def resolve_gender(self, info):
        return self.gender


class PaginatedArtistType(graphene.ObjectType):
    total_rows = graphene.Int()
    rows = graphene.List(ArtistType)


class Query(graphene.ObjectType):
    all_artist = graphene.Field(
        PaginatedArtistType,
        first=graphene.Int(),
        search=graphene.String(),
        skip=graphene.Int(),
    )

    artist_by_id = graphene.Field(
        ArtistType,
        id=graphene.Int(required=True),
    )

    my_artist_profile = graphene.Field(ArtistType)  
    @login_required
    def resolve_all_artist(self, info, search=None, first=None, skip=0):
        filters = Q(is_active=True)

        if search:
            filters &= Q(name__icontains=search)

        queryset = Artist.objects.filter(filters).order_by("-created_at")
        total_count = queryset.count()

        paginated = queryset[skip: skip + first] if first is not None else queryset[skip:]

        return PaginatedArtistType(total_rows=total_count, rows=list(paginated))

    @login_required
    def resolve_artist_by_id(self, info, id):
        try:
            return Artist.objects.get(id=id, is_active=True)
        except Artist.DoesNotExist:
            raise Exception("Artist not found")

    @login_required
    def resolve_my_artist_profile(self, info):  
        user = info.context.user
        if not user.is_artist:
            raise Exception("Only artists can access this.")
        try:
            return Artist.objects.get(user=user, is_active=True)
        except Artist.DoesNotExist:
            raise Exception("Artist profile not found. Please contact your manager.")


class ArtistInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    dob = graphene.Date(required=True)
    gender = GenderEnum(required=True)
    address = graphene.String(required=True)
    first_release_year = graphene.Int()
    no_of_albums_released = graphene.Int()
    user_id = graphene.ID() 


def _require_can_manage_artists(user):
    if not (user.is_super_admin or user.is_artist_manager):
        raise Exception("You do not have permission to manage artists.")


def _apply_artist_fields(artist, input):
    artist.name = input.name
    artist.dob = input.dob
    artist.gender = input.gender.value if hasattr(input.gender, "value") else input.gender
    artist.address = input.address
    if input.first_release_year is not None:
        artist.first_release_year = input.first_release_year
    if input.no_of_albums_released is not None:
        artist.no_of_albums_released = input.no_of_albums_released
    return artist


class CreateArtist(graphene.Mutation):
    class Arguments:
        input = ArtistInput(required=True)

    artist = graphene.Field(ArtistType)
    message = graphene.String()

    @login_required
    def mutate(self, info, input):
        _require_can_manage_artists(info.context.user)
        artist = Artist()
        _apply_artist_fields(artist, input)

    
        if input.user_id:
            from apps.users.models.user import User
            try:
                user = User.objects.get(id=input.user_id, role='artist')
                artist.user = user
            except User.DoesNotExist:
                raise Exception("User not found or is not an artist role.")

        artist.save()
        return CreateArtist(artist=artist, message="Artist created successfully!")


class UpdateArtist(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = ArtistInput(required=True)

    artist = graphene.Field(ArtistType)
    message = graphene.String()

    @login_required
    def mutate(self, info, id, input):
        _require_can_manage_artists(info.context.user)
        try:
            artist = Artist.objects.get(id=id, is_active=True)
        except Artist.DoesNotExist:
            raise Exception("Artist not found")
        _apply_artist_fields(artist, input)

        # ✅ optionally update linked user
        if input.user_id:
            from apps.users.models.user import User
            try:
                user = User.objects.get(id=input.user_id, role='artist')
                artist.user = user
            except User.DoesNotExist:
                raise Exception("User not found or is not an artist role.")

        artist.save()
        return UpdateArtist(artist=artist, message="Artist updated successfully!")


class DeleteArtist(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    message = graphene.String()

    @login_required
    def mutate(self, info, id):
        _require_can_manage_artists(info.context.user)
        try:
            artist = Artist.objects.get(id=id, is_active=True)
        except Artist.DoesNotExist:
            raise Exception("Artist not found")
        artist.is_active = False
        artist.save()
        return DeleteArtist(message="Artist deleted successfully!")


class Mutation(graphene.ObjectType):
    create_artist = CreateArtist.Field()
    update_artist = UpdateArtist.Field()
    delete_artist = DeleteArtist.Field()


artist_schema = graphene.Schema(query=Query, mutation=Mutation)