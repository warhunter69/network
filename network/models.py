from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    following = models.ManyToManyField("self" ,related_name="followers")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "date_joined": self.date_joined.strftime("%b %d %Y, %I:%M %p"),
            "following" : self.following,
            "followers" : self.followers,
           
           
        }
    


class Post(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="posts")
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likers = models.ManyToManyField("User" ,related_name="liked")
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "user": self.user.username,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
           
           
        }




