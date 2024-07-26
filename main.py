from flask import Flask, request, jsonify
from flask_cors import CORS

# self-defined libraries
from components.llama3_prompt0 import generate_recommendation
from components.llama3_prompt1 import generate_location_recommendation
from components import TravelCheck
from components.Categories import generate_activities

app = Flask(__name__)
CORS(app) # enables CORS for all routes


@app.route("/")
def index():
    #return "Hello"
    route_dict = {rule.endpoint: rule.rule for rule in app.url_map.iter_rules()}
    return jsonify(route_dict)


#######
# dummy API points
@app.route("/dummy-categories-passed")
def return_category():
    return jsonify({"status": "safe",
        "reply": ["Kid-friendly", "Pet-friendly", 
                                   "Wheelchair-friendly", "Shopping", 
                                   "Parks & Scenic Place", "Museum", 
                                   "Historical Site", "Food Galore"]}), 200

@app.route("/dummy-categories-failed")
def return_categoryfailed():
    return jsonify({
    "reply": "<Country> has a current risk level of 5 (out of 5). We advise: It is not safe to travel Afghanistan.",
    "status": "unsafe"
}), 200
#######


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

# to query available activities through Llama
# accessed via https://<flaskapp>/get-categories?city=london&country=United Kingdom
@app.route("/get-categories")
def get_categories():
    city = request.args.get("city")
    country = request.args.get("country")

    # presence check:
    if (city==None) and (country==None):
        return "Invalid request", 400

    # check if it is safe to travel to or not
    status, reply = TravelCheck.check_safety(country)
    if status == "safe":
        reply = generate_activities(city, country)
        # returns None if it failed?
        if reply == None:
            reply = "Error, could not generate activities"
            status = "error"


    return jsonify({"reply": reply,
                    "status": status}), 200


# to query a list of suggested locations through Bing and Llama APIs
# accessed by client-side's POST method 
# (react-gives a json of selected activities)
# @app.route("/get-recommendations", methods=['GET', ])
# def get_recommendations():
#     preferences_json = request.get_json()
#     #return jsonify(preferences_json)
#     #print(preferences_json)
#     result = generate_location_recommendation(preferences_json)
#     #print(result)
#     return jsonify(result), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)


# API 1:
#/get-categories?city=Balkh&country=Afghanistan
# /get-categories?city=Jakarta&country=Indonesia
# /get-categories?city=Vancouver&country=Canada
# /get-categories?city=Sydney&country=Australia
#/get-categories?city=Norfolk Island&country=Norfolk Island