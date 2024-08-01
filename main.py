# libraries used for routing and requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, initialize_app, firestore

# other libraries
import random

# self-defined libraries
from components import TravelCheck
from components.Categories import generate_activities
from components.GenerateFoodGalore import get_llama_foodgalore
from components.GenerateShopping import get_llama_shopping
from components.GenerateNightLife import get_llama_nightlife
from components.GenerateCulture import get_llama_culture
from components.GenerateOther import get_llama_others
from components.Cluster import get_results



app = Flask(__name__)
CORS(app) # enables CORS for all routes



# set-up db connection
try:
    cred_obj = credentials.Certificate('credentials.json')
    default_app = initialize_app(cred_obj)
except ValueError:
    pass

db = firestore.client()



@app.route("/")
def index():
    #return "Hello"
    route_dict = {rule.endpoint: rule.rule for rule in app.url_map.iter_rules()}
    return jsonify(route_dict)


@app.route("/testdb", methods=['GET'])
def testdb():
    test = db.collection('main-Itineraries').get()

    # Extract data from each document
    all_documents = []
    for doc in test:
        all_documents.append(doc.to_dict())
        # print(doc.to_dict())
    return all_documents


####
# Get: request data from a specified source
# Post: create a new resource, user submits a json
# Put: update a resource
# Delete: delete a resource
####

####
# 200: successful request
# 201: created a new resource successfully
# 400: server could not understand due to invalid syntax
# 403: forbidden request
# 404: could not find request
# 500: internal server error
# 503: server could not handle request, due to maintenance or overloaad
####


# accessed via https://<flaskapp>/get-categories?city=london&country=United Kingdom
@app.route("/get-categories", methods=['GET'])
def get_categories():
    city = request.args.get("city")
    country = request.args.get("country")

    # presence check:
    if (city==None) and (country==None):
        return "Invalid request", 400

    # check if it is safe to travel to or not
    status, reply = TravelCheck.check_safety(country)
    # generate an categories of activity regardless
    categories = generate_activities(city, country)
    if categories == None:
            categories = "Error, could not generate potential activity list"
            status = "error"

    return jsonify({"data": categories,
                    "reply": reply,
                    "safety_status": status}), 200


# accessed by client-side's POST method 
# accessed via /get-recommendations?itineraryID=&userID=
@app.route("/get-recommendations", methods=['GET'])
def get_recommendations():
     itineraryID = request.args.get("itineraryID")
     userID = request.args.get("userID") # or username

     preplanning_data = db.collection('main-PrePlanning').document(itineraryID).get().to_dict()
    
    # if userpreferences is a json and not a smaller collection
     userpreferences_data = db.collection('main-Preferences').document(itineraryID).get().to_dict()
     userpreferences_data = userpreferences_data.get(userID)


     # access db for the following information
    #  preplanning_data = {"city": "Cairo",
                        # "country": "Egypt"}
     
    #  userpreferences_data = {"dietaryRestriction": "Halal",
    #                          "travelStyle": ["Compact", "Tourist"],
    #                         #  "categoryActivities": ["Shopping"],
    #                         "categoryActivities": ["Shopping", "Kid-friendly", "Amusement Park"],
    #                         "budgetRange": "Low"}
     
     activities = userpreferences_data.get("categoryActivities")
     budget = userpreferences_data.get("budgetRange")
     city = preplanning_data.get("city")
     country = preplanning_data.get("country")
     recommendation_list = []

     if "Food Galore" in activities:
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_foodgalore(city, country, budget, userpreferences_data.get("dietaryRestriction"))
        if "Error" not in llama_summary[0]:
            recommendation_list.extend(llama_summary)
        # remove activity from the list
        activities.remove("Food Galore")

     elif "Shopping" in activities:
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_shopping(city, country)
        if "Error" not in llama_summary[0]:
            recommendation_list.extend(llama_summary)
        # remove activity from the list
        activities.remove("Shopping")

     elif "Night-life" in activities:
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_nightlife(city, country, budget, userpreferences_data.get("dietaryRestriction"))
        if "Error" not in llama_summary[0]:
            recommendation_list.extend(llama_summary)
        # remove activity from the list
        activities.remove("Night-life")

     elif "Theatre & Cultural" in activities:
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_culture(city, country, budget, activities)
        if "Error" not in llama_summary[0]:
            recommendation_list.extend(llama_summary)
        # remove activity from the list
        activities.remove("Theatre & Cultural")

     if activities:
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_others(city, country, budget, activities)
        if "Error" not in llama_summary[0]:
            recommendation_list.extend(llama_summary)

     random.shuffle(recommendation_list)
     # remains empty if there is no output
     return jsonify({"data": recommendation_list}), 201  



# accessed by client-side's POST method 
# accessed via /get-recommendations?itineraryID=
@app.route("/get-resulttrip", methods=['GET'])
def get_resulttrip():
    itineraryID = request.args.get("itineraryID")
    preplanning_data = db.collection('main-Itineraries').document(itineraryID).get().to_dict()

    start_date = preplanning_data.get("arrivalDate")
    end_date = preplanning_data.get("departureDate")
    no_days = (end_date - start_date).days
    

    arrival_time = preplanning_data.get("arrivalTime")
    deparature_time = preplanning_data.get("deparatureTime")
    arrival_pattern = {"Early-Morning": {"morning": [], "afternoon": [], "evening": []},
                       "Morning": {"afternoon": [], "evening": []},
                       "Afternoon": {"evening": []},
                       "Evening": {"morning": [], "afternoon": [], "evening": []}}
    departure_pattern = {"Early-Morning": {"morning": [], "afternoon": []},
                         "Morning": {"morning": [], "afternoon": []},
                         "Afternoon": {},
                         "Evening": {"morning-next-day": []}}
    start_day_template = arrival_pattern.get(arrival_time)
    end_day_template = departure_pattern.get(deparature_time)


    userpreferences_data = db.collection('main-Preferences').document(itineraryID).get().to_dict()
    
    currated_locations = []
    travel_stye = {"relaxed": 0, "compact": 0}
    budget_max = []

    # the keys would be the user's ID
    for user, indv_pref in userpreferences_data.items():
        currated_locations.extend(indv_pref.get("likes"))
        if "relaxed" in indv_pref.get("travelStyle"):
            travel_stye["relaxed"] = travel_stye["relaxed"] + 1
        elif "compact" in indv_pref.get("travelStyle"):
            travel_stye["compact"] = travel_stye["compact"] + 1
        budget_max.append(indv_pref.get("budgetRange")) # should be an integer though...

    # once all the data is set, we cluster & format it
    # return currated_locations, 200
    result, suggestion = get_results(currated_locations, no_days, start_day_template, end_day_template, travel_stye, budget_max)

    # save the trips to db
    doc_ref = db.collection('main-Trips').document(itineraryID).set({"itinerary": result, "suggestion": suggestion})

    # return to flask the result
    return jsonify({"dataResult": result,
                    "dataSuggestion": suggestion}), 200
     



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)


# API 1:
#/get-categories?city=Balkh&country=Afghanistan
# /get-categories?city=Jakarta&country=Indonesia
# /get-categories?city=Vancouver&country=Canada
# /get-categories?city=Sydney&country=Australia
#/get-categories?city=Norfolk Island&country=Norfolk Island

# API 2s:
# /get-recommendations?itineraryID=IGio4nbWEIooCfvuxv6m&userID=9orOez3uBYgA1m2OCzVTfhzaIUt1


# API 3s:
# /get-resulttrip?itineraryID=IGio4nbWEIooCfvuxv6m