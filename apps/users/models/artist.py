from django.db import models
from django.conf import settings

class GenderChoices(models.TextChoices):
    MALE = 'm', 'Male'
    FEMALE = 'f', 'Female'
    OTHER = 'o', 'Other'

class Artist(models.Model):
    user = models.OneToOneField(  
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='artist_profile'
    )
    name = models.CharField(max_length=255)
    dob = models.DateField()
    gender = models.CharField(max_length=1, choices=GenderChoices.choices)
    address = models.TextField()
    first_release_year = models.PositiveIntegerField(null=True)
    no_of_albums_released = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name