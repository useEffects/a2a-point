import os
import requests
import json
import secrets
import string

directus_url = "https://dashboard.a2apoint.com"
email = "admin@a2apoint.com"
password = "admin"


def get_access_token():
    res = requests.post(
        f"{directus_url}/auth/login", json={"email": email, "password": password}
    )
    return res.json()["data"]["access_token"]


def generate_token(length=32):
    characters = string.ascii_letters + string.digits
    token = "".join(secrets.choice(characters) for _ in range(length))
    return token
