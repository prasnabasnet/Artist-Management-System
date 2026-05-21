import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
import graphql_jwt
from graphql_jwt.decorators import login_required
from apps.users.models.user import RoleChoices

User = get_user_model()

RoleEnum = graphene.Enum.from_enum(RoleChoices)

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role")

class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    artist_users = graphene.List(UserType)  

    @login_required
    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Not logged in!")
        return user

    @login_required
    def resolve_artist_users(self, info):  
        requesting_user = info.context.user
        if not requesting_user.is_super_admin and not requesting_user.is_artist_manager:
            raise Exception("You do not have permission to view users.")
        return User.objects.filter(role=RoleChoices.ARTIST)

class RegisterUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    message = graphene.String()

    def mutate(self, info, email, password):
        if User.objects.filter(email=email).exists():
            raise Exception("User with this email already exists!")

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
        )
        return RegisterUser(user=user, message="User registered successfully!")

class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        role = RoleEnum(required=True)

    user = graphene.Field(UserType)
    message = graphene.String()

    @login_required
    def mutate(self, info, email, password, role):
        requesting_user = info.context.user
        role_value = role.value if hasattr(role, 'value') else role
        if requesting_user.is_super_admin:
            pass
        elif requesting_user.is_artist_manager:
            if role_value != RoleChoices.ARTIST:
                raise Exception("Artist Managers can only create Artist users.")
        else:
            raise Exception("You do not have permission to create users.")

        if User.objects.filter(email=email).exists():
            raise Exception("User with this email already exists!")

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            role=role_value,
        )
        return CreateUser(user=user, message=f"User with role {role_value} created successfully!")


class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    create_user = CreateUser.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


user_schema = graphene.Schema(query=Query, mutation=Mutation)