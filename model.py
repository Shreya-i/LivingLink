import firebase_admin
from firebase_admin import credentials, db
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import sys
import json

# Initialize Firebase
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://livinglink-dc4e2-default-rtdb.firebaseio.com/'
})

def encode(val):
    if isinstance(val, str):
        val = val.strip().upper()
        if val in ['TRUE', 'YES']:
            return 1
        elif val in ['FALSE', 'NO']:
            return 0
        elif val.isdigit():
            return int(val)
    return val

def get_vector(profile):
    return [
        encode(profile.get("budget_min")),
        encode(profile.get("budget_max")),
        encode(profile.get("cleanliness_level")),
        encode(profile.get("noise_tolerance")),
        encode(profile.get("party_tolerance")),
        encode(profile.get("pets_tolerance")),
        encode(profile.get("smoking_tolerance")),
        1 if profile.get("location_preference") == other.get("location_preference") else 0,
        1 if profile.get("branch_preference") == other.get("branch_preference") else 0,
        1 if profile.get("gender") == other.get("gender") else 0,
        1 if profile.get("gender_preference") == other.get("gender_preference") else 0,
    ]

if len(sys.argv) < 3:
    
    sys.exit(1)

uid1, uid2 = sys.argv[1], sys.argv[2]

ref = db.reference("profiles")
data = ref.get()

if uid1 not in data or uid2 not in data:
    
    sys.exit(1)

user = data[uid1]
other = data[uid2]

vec1 = get_vector(user)
vec2 = get_vector(other)



similarity = cosine_similarity([vec1], [vec2])[0][0]


threshold = 0.85
is_match = similarity >= threshold

print(json.dumps({"match": bool(is_match)}))

