from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import replicate
import ast
import re

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
                And give me a list of at least 9 locations, if possible, that are %s and it fits my %s budget
                Return a python list in the following format: 
                Combined list: [destination 1, destination 2, destination 3]

                Return a list ['error, no page found'] if the url given does not work"""

def get_lonelyplanet_url(country, city, activity):
    link1 = "https://www.lonelyplanet.com/{}/{}"
    link2 = "https://www.lonelyplanet.com/{}/{}/{}"
    country = country.lower()
    city = city.lower()
    
    if activity == "Shopping":
        if country == city:
            return link1.format(country, "shopping")
        return link2.format(country, city, "shopping")
    
    elif activity == "Night-life":
        if country == city:
             return link1.format(country, "nightlife")
        return link2.format(country, city, "nightlife")
    
    elif activity == "Food Galore":
        if country == city:
             return link1.format(country, "restaurants")
        return link2.format(country, city, "restaurants")
    
    else:
        if country == city:
             return link1.format(country, "attractions"), link1.format(country, "entertainment"),
        return link2.format(country, city, "attractions"), link2.format(country, city, "entertainment")
    

def get_llama_summary(site, activities, budget, pre_prompt=pre_prompt, prompt_input=prompt_input):
    prompt_input = prompt_input % (site, activities, budget)
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

        # formatting by finding where Combined list:
        # print(result)
        match = re.search(r'\b' + re.escape('Combined list') + r'\b', result)
        if match:
            index = match.end()
            result = result[index+1:].strip()
            index = result.find(']')
            # finalised list but string form "[..., ..., ...]"
            result = result[:index+1].replace("*", "").strip()
            # print('finalised list:', result)
            # need to remove the brackets & make it into a list
            result = result[1:-1].split(",")
            finalised_result = []
            for res in result:
                finalised_result.append(res.strip().replace("\'", ""))
            return finalised_result
        else:
            # Llama generation error
            print("Invalid URL", site)
            return None

    except:
        # if error
        print("Failed to generate any prompt")
        return None


def summary(itinerary_id=None):
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
    budget = user_data["budget"]
    location_list = []

    # website lists from lonely planet
    if "Shopping" in activities_list:
        site = get_lonelyplanet_url(country, city, "Shopping")
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_summary(site, "Shopping", budget)
        if llama_summary:
            location_list.extend(llama_summary)
        # remove activity from the list
        activities_list.remove("Shopping")

    elif "Night-life" in activities_list:
        site = get_lonelyplanet_url(country, city, "Night-life")
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_summary(site, "Night-life", budget)
        if llama_summary:
            location_list.extend(llama_summary)
        # remove activity from the list
        activities_list.remove("Night-life")

    elif "Food Galore" in activities_list:
        site = get_lonelyplanet_url(country, city, "Food Galore")
        # outputs at most 9 locations for each activity => list form
        llama_summary = get_llama_summary(site, "Food Galore", budget)
        if llama_summary:
            location_list.extend(llama_summary)
        # remove activity from the list
        activities_list.remove("Food Galore")

    if activities_list:
        llama_summary = get_llama_summary(site, activities_list, budget)
        if llama_summary:
            location_list.extend(llama_summary)


    return location_list
    



    # return({"length": length, 
    #         "data": locations_recommendations})
           


#############################################################
# this function is just to get a list of destinations
# print(get_llama_summary("https://www.lonelyplanet.com/singapore/attractions", 
#                         ["Museum", "Historical Site", "Theater & Cultural"],
#                         "High"))

# this function accounts for db input
print(summary())