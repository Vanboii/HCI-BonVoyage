from flask import Flask, request, jsonify

# self-defined libraries
from components.llama3_prompt0 import generate_recommendation
#from components.llama3_prompt1 import locations_recommendations_url

app = Flask(__name__)

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

# to query available activities through llama
# accessed via https://<flaskapp>/get-categories?city=london&country=unitedkingdom
#/get-categories?city=Norfolk Island&country=Norfolk Island
#/get-categories?city=Balkh&country=Afghanistan
# @app.route("/get-categories")
# def get_categories():
#     city = request.args.get("city")
#     country = request.args.get("country")
#     # presence check:
#     if (city==None) and (country==None):
#         return "Invalid request", 400
#     else:
#         #return (city, country)
#         return jsonify(generate_recommendation(city, country)), 200




if __name__ == "__main__":
    app.run(debug=True)
