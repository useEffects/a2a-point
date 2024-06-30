import requests
import lib

DIRECTUS_RESOURCE_UPDATE_MANAGER_TOKEN = "McO8UnXyihPsCUlzWb5hDZDNuSqyVenw"
DIRECTUS_SYSTEM_TOKEN = "Mnh7gFAmU4QeNRt_TQhTBrDDBxFdjPNu"

users = [
    {
        "id": "0c0f475e-ac7d-4cee-b984-f500f70e674e",
        "token": "McO8UnXyihPsCUlzWb5hDZDNuSqyVenw",
        "role": "Update Manager",
    },
    {
        "id": "067d1b6f-a09a-4eaf-934c-73e7fc9f9058",
        "token": "Mnh7gFAmU4QeNRt_TQhTBrDDBxFdjPNu",
        "role": "System",
    },
]

access_token = lib.get_access_token()

for user in users:
    res = requests.patch(
        f"https://dashboard.a2apoint.com/users/{user['id']}",
        json={"token": user["token"]},
        headers={"Authorization": f"Bearer {access_token}"},
    )
