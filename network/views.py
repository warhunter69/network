from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User , Post


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

@login_required
def Allposts(request):
    posts = Post.objects.all()
    
    posts = posts.order_by("-timestamp").all()
    
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
@login_required
def profile(request, username):

    # Query for requested email
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)

    # Return email contents
    if request.method == "GET":
        return JsonResponse(user.serialize())

    # # Update whether email is read or should be archived
    # elif request.method == "PUT":
    #     data = json.loads(request.body)
    #     if data.get("read") is not None:
    #         email.read = data["read"]
    #     if data.get("archived") is not None:
    #         email.archived = data["archived"]
    #     email.save()
    #     return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)