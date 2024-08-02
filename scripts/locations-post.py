import requests

locations = [
    "Mesk District",
    "Mir Hills",
    "Mirdif Tulip",
    "Nshama",
    "Old Town",
    "Oman",
    "Park Gate Residences",
    "Remraam",
    "Sheikh Zayed Road",
    "The Greens",
    "The Springs",
    "The Sustainable City",
    "The Villa",
    "Dubai Science Park",
    "Dubai Silicon Oasis",
    "Dubai Water Canal",
    "Dubai Waterfront",
    "Emirates Hills",
    "Expo City Dubai",
    "Creekside",
    "Culture Village",
    "Damac Lagoons",
    "Discovery Gardens",
    "Dubai Design District",
    "Dubai Festival City",
    "Al Khail Heights",
    "Al Reem Island, Abu Dhabi",
    "Al Wasl (City Walk)",
    "Arabian Ranches",
    "Arjan",
    "Cherrywoods",
    "City of Arabia",
    "Al Furjan",
    "District one",
]

payload = []

for location in locations:
    payload.append({"title": location, "type": "group"})

token = "FcohKLOEi_mx_AyXLRwtoQ2PkeyhaQoU"
url = "https://dashboard.a2apoint.com"

res = requests.post(
    f"{url}/items/rooms", headers={"Authorization": f"Bearer {token}"}, json=payload
)
print(res.json())
