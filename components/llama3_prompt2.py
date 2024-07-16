import firebase_admin
from firebase_admin import credentials, firestore


# initialise db, only once
try:
    cred = credentials.Certificate('localhash/db_config.json')
    app = firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()

test = db.collection('testPrac').get()

# Extract data from each document
all_documents = []
for doc in test:
    #all_documents.append(doc.to_dict())
    print(doc.to_dict())