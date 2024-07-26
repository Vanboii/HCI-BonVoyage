from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import replicate
import ast

import firebase_admin
from firebase_admin import credentials, firestore


# admin configuation 
load_dotenv()
BING_SUBSCRIPTION_KEY = os.environ['BING_SUBSCRIPTION_KEY']
REPLICATE_API_TOKEN = os.environ['REPLICATE_API_TOKEN']


# initialise db, only once
try:
    cred = credentials.Certificate('localhash/db_config.json')
    app = firebase_admin.initialize_app(cred)
except ValueError:
    pass

db = firestore.client()


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



# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                Return a python list in the following format: [list of potential categories]"""


prompt_input = """Summarise this website(s) %s
                And give me a list of at most 9 locations that are %s
                Return a python list in the following format: 
                Combined list: [destination 1, destination 2, destination 3]

                Return a list ['error, no page found'] if the url given does not work"""

def get_lonelyplanet_url(country, city, activity):
    if activity == "Shopping":
         return "https://www.lonelyplanet.com/{}/{}/shopping".format(country, city)
    
    elif activity == "Night-life":
        return "https://www.lonelyplanet.com/{}/{}/nightlife".format(country, city)
    
    elif activity == "Food Galore":
        return "https://www.lonelyplanet.com/{}/{}/restaurants".format(country, city)
    
    else:
        link1 = "https://www.lonelyplanet.com/{}/{}/attractions".format(country, city)
        link2 = "https://www.lonelyplanet.com/{}/{}/entertainment".format(country, city)
        return (link1, link2)
    

def get_llama_summary(site, activities, pre_prompt=pre_prompt, prompt_input=prompt_input):
    prompt_input = prompt_input % (site, activities)
    result = ""

    try:
        for event in replicate.stream(
        "meta/meta-llama-3-8b-instruct",
        input={
            "seed": 2,
            "top_k": 0,
            "top_p": 0.95,
            "prompt": prompt_input,
            "max_tokens": 512,
            "temperature": 0.7,
            "system_prompt": pre_prompt,
            "length_penalty": 1,
            "max_new_tokens": 512,
            "stop_sequences": "<|end_of_text|>,<|eot_id|>",
            "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
            "presence_penalty": 0,
            "log_performance_metrics": False
        },
        ):
            # print(str(event), end="")
            result += str(event)

        return result

    except:
        # if error
        return None


def summary(itenirary_id):
    # access db for the following:
    user_data = {"city": "Cairo",
                 "country": "Egypt",
                 "activities": ["Shopping", "Kid-friendly", "Amusement Park"],
                 "travel style": ["Compact", "Tourist"],
                 "budget": "Low"}
    

    # unpack the user_data
    city = user_data["city"]
    country = user_data["country"]
    activities_list = user_data["activities"]
    location_list = []

    # website lists from lonely planet
    if "Shopping" in activities_list:
        site = get_lonelyplanet_url(country, city, "Shopping")
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_summary(site, "Shopping")
        if llama_summary:
            location_list.extend(llama_summary)
        # remove activity from the list
        activities_list.remove("Shopping")

    elif "Night-life" in activities_list:
        site = get_lonelyplanet_url(country, city, "Night-life")
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_summary(site, "Night-life")
        if llama_summary:
            location_list.extend(llama_summary)
        # remove activity from the list
        activities_list.remove("Night-life")

    elif "Food Galore" in activities_list:
        site = get_lonelyplanet_url(country, city, "Food Galore")
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_summary(site, "Food Galore")
        if llama_summary:
            location_list.extend(llama_summary)
        # remove activity from the list
        activities_list.remove("Food Galore")

    if activities_list:
        llama_summary = get_llama_summary(site, activities_list)
        if llama_summary:
            location_list.extend(llama_summary)


    return activities_list
    



    # return({"length": length, 
    #         "data": locations_recommendations})
           


#############################################################
# taken from react-server, activities preferences
acitivities_json = {
    "budget": "$1000",
    "category": [
        "Kid friendly",
        "Shopping",
        "Wheelchair friendly"
    ],
    "city": "London",
    "country": "United Kingdom",
    "month": "January"} # "Amusement Parks", "Museums"

# locations_recommendations_url = create_search_term_recommendations(acitivities_json)
# print(locations_recommendations_url)

# acitivities_json = {"country": "Albania",
#  "city": "Fier",
# "category": [
#         "Food Galore"
#     ],
#  "month": "July",
#  "budget": "$1250"
# } # "Amusement Parks", "Museums"

data = generate_location_recommendation(acitivities_json)
print(data)