import os
import requests
import json
import secrets
import string

directus_url = "https://dashboard.a2apoint.com"
email = "info@a2apoint.com"
password = "Nvarco@9645"


def get_access_token():
    return "XydGQI75IRhuoB1YAYmfx1pkCopqJ6Mc"

def generate_token(length=32):
    characters = string.ascii_letters + string.digits
    token = "".join(secrets.choice(characters) for _ in range(length))
    return token
