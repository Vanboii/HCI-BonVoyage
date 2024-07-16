import firebase_admin
from firebase_admin import credentials, firestore


# initialise db, only once
try:
    cred = credentials.Certificate('localhash/db_config.json')
    app = firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()

# access db under 'itineraries' collction
def get_row(destination_id):
    itinerary = db.collection('itineraries').where("Destination_id", "==", destination_id).get()
    users = itinerary.collection('userPreferences').get()
    # extract a the whole row from each document
    for doc in query:
        #all_documents.append(doc.to_dict())
        print(doc.to_dict())

get_row("China")