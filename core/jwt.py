from graphql_jwt.settings import jwt_settings
import datetime

def jwt_payload(user, context=None):
    now = datetime.datetime.now(datetime.timezone.utc)
    return {
        "email": user.email,
        "role": user.role,
        "exp": now + jwt_settings.JWT_EXPIRATION_DELTA,
        "origIat": now.timestamp(),
    }