import firebase_admin
from firebase_admin import credentials, firestore


# initialise db, only once
try:
    cred = credentials.Certificate('localhash/db_config.json')
    app = firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()

#def get_itinerary_details(destination_id):


# access db under 'itineraries' collection
def get_all_preferences(itinerary_id):
    #itinerary = db.collection('itineraries').where("Destination_id", "==", destination_id).get()
    
    users = itinerary.collection('userPreferences').get()
    preferences_list = []
    locations_list = [] #["The London Eye"]

    # for each user, only extract the preferences (like)
    # eg: userPreferences:{"UserA": , "likes":, "dislikes":}, {"UserB": , "likes":, "dislikes":}
    # likes:[{location1: , imgURL: , 'description': }, {location2: , imgURL: , 'description': }, {location3: , imgURL: , 'description': }]
    for user in users:
        user = user.to_dict()
        user_pref = user.get("likes")
        preferences_list.expand(user_pref)

        # get all locations in a list
        for pref in user_pref:
            locations_list.append(pref)
    

    # ask chatgpt to create itenenary for each user

#############################################################
# returns:
# {"Day 1":{ "destinations": [{
#         "Location": location,
#         "Cost": cost,
#         "Opening hours": opening hours
#         "Description": description,
#         },
#         {
#         "Location": location,
#         "Cost": cost,
#         "Opening hours": opening hours
#         "Description": description,
#         }],
#         "daily cost": react side},
        
# "Day 2": ...}

# any expenses should be handles by react side?


