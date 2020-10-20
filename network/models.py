from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Count
class User(AbstractUser):
    following = models.ManyToManyField("User" ,related_name="followers")
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)


    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "date_joined": self.date_joined.strftime("%b %d %Y, %I:%M %p"),
            "following" : self.following_count,
            "followers" : self.followers_count,
           
        }
    

# class follow(models.Model):
#     following = models.ManyToManyField(User ,related_name="followers")


class Post(models.Model):
    
    user = models.ForeignKey("User", on_delete=models.CASCADE,related_name="posts")
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField("User" ,related_name="liked")
    likes_count = models.IntegerField(default=0)
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "user": self.user.username,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likers" :  [user.username for user in self.like.all()],
            "likes_count" : self.likes_count,
           
        }




