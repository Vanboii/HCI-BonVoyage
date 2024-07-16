from flask import Flask, request, jsonify
from flask_cors import CORS

# self-defined libraries
from components.llama3_prompt0 import generate_recommendation
from components.llama3_prompt1 import generate_location_recommendation

app = Flask(__name__)
CORS(app) # enables CORS for all routes


@app.route("/")
def index():
    return "Hello"


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
#/get-categories?city=Norfolk Island&country=Norfolk Island
#/get-categories?city=Balkh&country=Afghanistan
@app.route("/get-categories")
def get_categories():
    city = request.args.get("city")
    country = request.args.get("country")
    # presence check:
    if (city==None) and (country==None):
        return "Invalid request", 400
    else:
        return jsonify(generate_recommendation(city, country)), 200


# to query a list of suggested locations through Bing and Llama APIs
# accessed by client-side's POST method 
# (react-gives a json of selected activities)
@app.route("/get-recommendations")
def get_recommendations():
    preferences_json = request.get_json()
    #return jsonify(preferences_json)
    #print(preferences_json)
    result = generate_location_recommendation(preferences_json)
    #print(result)
    return jsonify(result), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
