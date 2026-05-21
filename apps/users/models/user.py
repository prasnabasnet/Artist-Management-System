from django.contrib.auth.models import AbstractUser
from django.db import models


class RoleChoices(models.TextChoices):
    SUPER_ADMIN = 'super_admin', 'Super Admin'
    ARTIST_MANAGER = 'artist_manager', 'Artist Manager'
    ARTIST = 'artist', 'Artist'


class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.ARTIST
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_set",
        blank=True,
    )

    def __str__(self):
        return self.email
    
    @property
    def is_super_admin(self):
        return self.role == RoleChoices.SUPER_ADMIN
    
    @property
    def is_artist_manager(self):
        return self.role == RoleChoices.ARTIST_MANAGER

    @property
    def is_artist(self):
        return self.role == RoleChoices.ARTIST