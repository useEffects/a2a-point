import json
import lib
import requests


def post_folders():
    access_token = lib.get_access_token()
    with open("assets/folders.json", "r") as f:
        folders = json.loads(f.read())["data"]
    existing_folders = requests.get(
        f"{lib.directus_url}/folders",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()["data"]

    folders_to_post = [
        f for f in folders if f["id"] not in [ef["id"] for ef in existing_folders]
    ]

    res = requests.post(
        f"{lib.directus_url}/folders",
        json=folders_to_post,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    print(res)


post_folders()
