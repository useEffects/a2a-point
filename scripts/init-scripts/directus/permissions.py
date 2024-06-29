import json
import lib
import requests


def post_permissions():
    access_token = lib.get_access_token()
    with open("assets/permissions.json", "r") as f:
        permissions = json.loads(f.read())["data"]
        permissions = [p for p in permissions if "id" in p]
    existing_permissions = requests.get(
        f"{lib.directus_url}/permissions",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()["data"]

    existing_permission_ids = [ep["id"] for ep in existing_permissions if "id" in ep]
    permissions_to_post = [
        p
        for p in permissions
        if p["id"] not in [ep["id"] for ep in existing_permission_ids]
    ]

    res = requests.post(
        f"{lib.directus_url}/permissions",
        json=permissions_to_post,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    print(res)


post_permissions()
