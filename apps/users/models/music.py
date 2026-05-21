from django.db import models
from apps.users.models.artist import Artist

class GenreChoices(models.TextChoices):
    ROCK = 'rock', 'Rock'
    POP = 'pop', 'Pop'
    JAZZ = 'jazz', 'Jazz'
    CLASSICAL = 'classical', 'Classical'
    HIP_HOP = 'hip_hop', 'HipHop'
    RNB = 'rnb', 'R&B'
    COUNTRY = 'country', 'Country'
    BLUES = 'blues', 'Blues'
    OTHER = 'other', 'Other'

class Music(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='songs')
    title = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255)
    genre = models.CharField(max_length=20, choices=GenreChoices.choices, default=GenreChoices.OTHER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} by {self.artist.name}"