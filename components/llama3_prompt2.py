import firebase_admin
from firebase_admin import credentials, firestore


# initialise db, only once
try:
    cred = credentials.Certificate('localhash/db_config.json')
    app = firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()

# access db under 'itineraries' collection
def get_all_preferences(destination_id):
    itinerary = db.collection('itineraries').where("Destination_id", "==", destination_id).get()
    users = itinerary.collection('userPreferences').get()
    preferences_list = []
    locations_list = []

    # for each user, only extract the preferences (like)
    # eg: userPreferences:{"UserA": , "likes":, "dislikes":}, {"UserB": , "likes":, "dislikes":}
    # likes:[{location1: , imgURL: , 'description': }, {location2: , imgURL: , 'description': }, {location3: , imgURL: , 'description': }]
    for user in users:
        #all_documents.append(doc.to_dict())
        preferences_list.expand(user.get("likes"))

        # ask llama to create itenenary for each user

get_row("China")