
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:name>", views.profile, name="profile"),
    path("Following",views.FollowingPage,name="FollowingPage"),

    # API Routes
    path("addpost", views.Newpost, name="Newpost"),
    path("like",views.like,name="like"),
    path("edit/<int:post_id>",views.edit,name="edit"),
]
