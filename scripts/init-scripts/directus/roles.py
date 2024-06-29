import requests
import json
import lib
import os

def post_roles():
    access_token = lib.get_access_token()
    with open("assets/roles.json", "r") as f:
        data = json.loads(f.read())["data"]
        roles = [role for role in data if role["name"] not in ["Administrator"]]
        roles = [{k: v for k, v in role.items() if k != "users"} for role in roles]

    existing_roles = requests.get(
        f"{lib.directus_url}/roles", headers={"Authorization": f"Bearer {access_token}"}
    ).json()["data"]

    os.remove(".env") if os.path.exists(".env") else None

    for [i, role] in enumerate(roles):
        if any(
            role["name"] == existing_role["name"] for existing_role in existing_roles
        ):
            if role["name"] not in ["Administrator", "Member"]:
                with open("assets/users.json") as f:
                    users = json.loads(f.read())["data"]
                    user = [user for user in users if user["role"] == role["id"]][0]
                    res = requests.post(  ## would fail if user already exists and thats ok
                        f"{lib.directus_url}/users",
                        json=user,
                        headers={"Authorization": f"Bearer {access_token}"},
                    )
                    token = lib.generate_token()
                    res = requests.patch(
                        f"{lib.directus_url}/users/{user['id']}",
                        json={"token": token},
                        headers={"Authorization": f"Bearer {access_token}"},
                    )
                    with open(".env", "a") as f:
                        f.write(
                            f"\nDIRECTUS_{role['name'].upper().replace(' ', '_')}_TOKEN={token}"
                        )

        else:
            res = requests.post(
                f"{lib.directus_url}/roles",
                json=role,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            print(res)
            print(role["name"])


post_roles()
