from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import *


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def Newpost(request):

   
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

 
    data = json.loads(request.body)
    print(data)
   
    body = data.get("body", "")
    print(data)
    user = request.user
    post = Post(
        user=user,
        content = body,
    )
    post.save()
   

    return JsonResponse({"message": "Post saved."}, status=201)

def Allposts(request):
    posts = Post.objects.all()
    
    posts = posts.order_by("-timestamp").all()
    
    return JsonResponse([post.serialize() for post in posts], safe=False)

def userposts(request,name):
    u = User.objects.get(username=name)
    posts = Post.objects.filter(user=u)
    posts = posts.order_by("-timestamp").all()
    
    return JsonResponse([post.serialize() for post in posts], safe=False)


def profile(request, name):

    if request.method == "POST":
        prf = User.objects.get(username=name)
        user = User.objects.get(username=request.user.username)
        print("e")
        if(user in prf.followers.all()):
            prf.followers.remove(user)
        else:
           
            prf.followers.add(user)
            
        print(len(prf.followers.all()))
        prf.followers_count = len(prf.followers.all())
        user.following_count = len(user.following.all())
        prf.save()
        user.save()
        

        return HttpResponseRedirect(reverse("profile",args=(name,)))



    prf = User.objects.get(username=name)
    msg = ""
    
    if request.user.is_authenticated:
        #print(request.user.username)
        user = User.objects.get(username=request.user.username)
        if(user.username != prf.username):
            #print(user.username,prf.username)
            if(user in prf.followers.all()):
                msg = "unfollow"
            else:
                msg = "follow"
                #prf.followers.add(user)
        

    #print(user.username)
    #  if l in u.watching.all():
    #         u.watching.remove(l)
    #         #print("wat")
    #     else:
    #         #print("woo")
    #         u.watching.add(l)
    #if 

    return render(request, "network/profile.html",{
        "prf" : prf,
        "msg" : msg,

    })

@csrf_exempt
@login_required
def like(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    postid = data.get("postid", "")
    post = Post.objects.get(id=postid)
    user = request.user
    print(post.serialize())

    if(user in post.like.all()):
        post.like.remove(user)
        post.likes_count = len(post.like.all())
        print("hi")
        post.save()
        return JsonResponse({"message": "post disliked."}, status=201)
    else:
        post.like.add(user)
        post.likes_count = len(post.like.all())
        print("hi")
        post.save()
        return JsonResponse({"message": "post liked."}, status=201)
    #print(request.user.username)
    #print(data)
   
    #print(postid)
    


# def userposts(request,name):
#     u = User.objects.get(username=name)
#     posts = Post.objects.filter(user=u)
#     posts = posts.order_by("-timestamp").all()
    
#     return JsonResponse([post.serialize() for post in posts], safe=False)

def FollowingPost(request):
    user = request.user
    fp = Post.objects.none()

    u = user.following
    for i in u.iterator():
        print("=",i.username)
        posts = Post.objects.filter(user=i)
        fp =  posts | fp
    fp = fp.order_by("-timestamp").all()
    
    return JsonResponse([post.serialize() for post in fp], safe=False)


def FollowingPage(request):
    return render(request, "network/following.html")


@csrf_exempt
@login_required
def edit(request, post_id):
      # Query for requested post
    try:
        post = Post.objects.get(user=request.user, pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    
    # Update post
    if request.method == "PUT":
        data = json.loads(request.body)
        
        if data.get("content") is not None:
            post.content = data["content"]
        post.save()
        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": " PUT request required."
        }, status=400)
