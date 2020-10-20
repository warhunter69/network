
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:name>", views.profile, name="profile"),
    #path("follow",views.follow,name="follow"),
    #path("like/<str:name>",views.like,name="like"),
    path("Following",views.FollowingPage,name="FollowingPage"),

    # API Routes
    path("addpost", views.Newpost, name="Newpost"),
    path("allposts", views.Allposts, name="Allposts"),
    path("like",views.like,name="like"),
    path("allposts/<str:name>",views.userposts,name="userposts"),
    path("FollowingPost",views.FollowingPost,name="FollowingPost"),
    path("edit/<int:post_id>",views.edit,name="edit"),
]
