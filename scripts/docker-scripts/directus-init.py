import os
import requests
import subprocess
import time
import json
import logging

KC_USERNAME = os.environ.get("KC_USERNAME")
KC_PASSWORD = os.environ.get("KC_PASSWORD")
KC_CLIENT_ID = os.environ.get("KC_CLIENT_ID")
KC_REALM = "master"
KC_URL = "http://auth:8080"
DIRECTUS_URL = "http://localhost:8055"


def get_access_token():
    payload = {
        "username": KC_USERNAME,
        "password": KC_PASSWORD,
        "grant_type": "password",
        "client_id": "admin-cli",
    }
    res = requests.post(
        f"{KC_URL}/realms/{KC_REALM}/protocol/openid-connect/token",
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    return res.json()["access_token"]


def create_or_retrieve_client_secret():
    access_token = get_access_token()
    res = requests.get(
        f"{KC_URL}/admin/realms/{KC_REALM}/clients",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    clients = res.json()
    client_uuid = None
    for client in clients:
        if client["clientId"] == KC_CLIENT_ID:
            client_uuid = client["id"]
            break

    if not client_uuid:
        secret = os.urandom(32).hex()
        payload = {
            "clientId": KC_CLIENT_ID,
            "name": "directus for a2apoint",
            "enabled": True,
            "clientAuthenticatorType": "client-secret",
            "redirectUris": [
                "https://dashboard.a2apoint.com/auth/login/keycloak/callback",
                "https://dev.dashboard.a2apoint.com/auth/login/keycloak/callback",
            ],
            "secret": secret,
        }
        res = requests.post(
            f"{KC_URL}/admin/realms/{KC_REALM}/clients",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        res.raise_for_status()
        return secret
    else:
        res = requests.post(
            f"{KC_URL}/admin/realms/{KC_REALM}/clients/{client_uuid}/client-secret",
            headers={"Authorization": f"Bearer {access_token}"},
        ).json()
        return res["value"]


def directus_health_check():
    try:
        res = requests.get(f"{DIRECTUS_URL}/server/health")
        return res.status_code == 200
    except:
        return False


def keycloak_health_check():
    try:
        res = requests.get(f"{KC_URL}/health/ready")
        return res.status_code == 200
    except requests.RequestException as e:
        return False


while not keycloak_health_check():
    time.sleep(10)

client_secret = create_or_retrieve_client_secret()
os.environ["AUTH_KEYCLOAK_CLIENT_SECRET"] = client_secret
os.environ["AUTH_KEYCLOAK_CLIENT_ID"] = KC_CLIENT_ID
os.environ["AUTH_KEYCLOAK_ISSUER_URL"] = (
    f"{KC_URL}/realms/{KC_REALM}/.well-known/openid-configuration"
)
directus_start_command = (
    "cd /app/apps/directus && yarn bootstrap && yarn snapshot-apply && yarn start"
)
subprocess.run(directus_start_command, shell=True)
