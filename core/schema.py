import graphene
import graphql_jwt
import apps.users.schemas.user as user
import apps.users.schemas.artist as artist
import apps.users.schemas.music as music

class Query(user.user_schema.Query, artist.artist_schema.Query, music.music_schema.Query, graphene.ObjectType):
    pass

class Mutation(user.user_schema.Mutation, artist.artist_schema.Mutation, music.music_schema.Mutation, graphene.ObjectType):

    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    

schema = graphene.Schema(query=Query, mutation=Mutation)