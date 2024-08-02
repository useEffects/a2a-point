import json
import requests


locations = [
    ("Palm Jebel Ali", "Palm Jebel Ali.jpg"),
    ("Downtown", "Palm Jebel Ali.jpg"),
    ("Business Bay", "Business Bay.jpg"),
    ("Dubai Marina", "Dubai Marina.jpg"),
    ("Palm Jumeirah", "Palm Jumeirah.jpg"),
    ("Emaar Beachfront", "Emaar Beachfront.jpg"),
    ("MBR City - Meydan", "MBR City - Meydan.png"),
    ("Dubai Creek Harbour", "Dubai Creek Harbour.png"),
    ("Dubai Hills Estate", "Dubai Hills Estate.jpg"),
    ("Damac Hills", "Damac Hills.jpg"),
    ("Al Barari", "Al Barari.jpg"),
    ("Al Barsha", "Al Barsha.jpg"),
    ("Al Ghadeer", "Al Ghadeer.jpg"),
    ("Al Habtoor City", "Al Habtoor City.jpg"),
    ("Al Jaddaf", "Al Jaddaf.jpg"),
    ("Al Marjan Island", "Al Marjan Island.jpg"),
    ("Al Sufouh", "Al Sufouh.jpg"),
    ("Barsha Heights", "Barsha Heights.jpg"),
    ("Bluewaters Island", "Bluewaters Island.jpg"),
    ("DHCC - Dubai Healthcare City", "DHCC - Dubai Healthcare City.jpg"),
    ("DMC - Dubai Maritime City", "DMC - Dubai Maritime City.jpg"),
    ("Dubai Harbour", "Dubai Harbour.jpg"),
    ("Dubai International City", "Dubai International City.jpg"),
    (
        "Dubai International Financial Centre | DIFC",
        "Dubai International Financial Centre.jpg",
    ),
    ("Dubai Production City | IMPZ", "Dubai Production City.jpg"),
    ("Dubai Sports City", "Dubai Sports City.jpg"),
    ("Dubai Studio City", "Dubai Studio City.jpg"),
    ("Corniche area", "Corniche area.jpg"),
    ("Saadiyat Island", "Saadiyat Island.jpg"),
    ("Al Maryah Island", "Al Maryah Island.jpg"),
    ("Tourist Club Area", "Tourist Club Area.jpg"),
    ("Al Khalidiyah", "Al Khalidiyah.jpg"),
    ("Al Raha", "Al Raha.jpg"),
]

payload = []


token = "FcohKLOEi_mx_AyXLRwtoQ2PkeyhaQoU"
url = "https://dashboard.a2apoint.com"

for location in locations:
    data = json.dumps(
        {
            "title": location[0],
        }
    )
    with open(f"/home/aprilia/Downloads/D land/{location[1]}", "rb") as image:
        files = {"file": (location[1], image, "image/jpeg")}
        imageRes = requests.post(
            f"{url}/files",
            headers={"Authorization": f"Bearer {token}"},
            files=files,
            data={
                "title": location[0],
                "folder": "e74b3977-e788-48e3-b51d-35a6bbcdd2ea"
            },
        )
        res = requests.post(f"{url}/items/rooms", headers={"Authorization": f"Bearer {token}"}, json={
            "title": location[0],
            "type": "group",
            "avatar": imageRes.json()["data"]["id"]
        })
