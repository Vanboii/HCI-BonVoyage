# -*- coding: utf-8 -*-
from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import replicate
import json
import requests


# admin configuation 
load_dotenv()
REPLICATE_API_TOKEN = os.environ['REPLICATE_API_TOKEN']
BING_SUBSCRIPTION_KEY = os.environ['BING_SUBSCRIPTION_KEY']
GOOGLE_API_KEY = os.environ['GOOGLE_API_KEY']



# get geolocation returns {"lat": ...., "lng":...}
def get_location(name, city, country, API_KEY=GOOGLE_API_KEY):
    address = name + " " + city + " " + country
    base_url = "https://maps.googleapis.com/maps/api/geocode/json?"

    params = {
    'key': API_KEY,
    'address': address
    }

    response = requests.get(base_url, params=params).json()

    if response.get("status") == "OK":
        location = response.get("results")[0].get("geometry").get("location")
        place_id = response.get("results")[0].get("place_id")
        return location, place_id

    else:
        print("error in google maps geoencoder api")
        return None



def get_website(place_id, API_KEY=GOOGLE_API_KEY):
    base_url = "https://maps.googleapis.com/maps/api/place/details/json?"

    params = {
    'key': API_KEY,
    'place_id': place_id
    }

    response = requests.get(base_url, params=params).json()

    if response.get("status") == "OK":
        # returns none if no website found
        return response.get("result").get("address_components")[0].get("website")

    else:
        print("error in google maps websites api")
        return None



# URL/references
def get_lonelyplanet_url(city, country):
    link1 = "https://www.lonelyplanet.com/{}/{}"
    link2 = "https://www.lonelyplanet.com/{}/{}/{}"
    country = country.lower()
    city = city.lower()
    
    if country == city:
        return link1.format(country, "shopping")
    return link2.format(country, city, "shopping")
    

# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                Return a python dictionary, contained in a list in the following format: 
                Combined list: [{destination 1 name: "", destination 1 description: "", "destination 1 budget": "", "destination 1 openingHours": "", "destination 1 website": ""}, 
                                {"destination 2 name": "", "destination 2 description": "", "destination 2  budget": "", "destination 2 openingHours": "", "destination 2 website": ""}]"""


prompt_input = """Summarise this website %s

                If the url is invalid, you are free to give alternatives from the internet, especially from local blogs as long as it is in %s, %s.

                Give me a list of 9 shopping malls or districts, if you can, along with 2-3 sentences of description for each mall. 

                The description could entail about what luxury brands or well-known local brands in the mall and its ambience. If the mall or shopping district have other activities such as an IMAX theatre or a ice skating ring, include that as well.
                As well as its opening hours and its website, if it exists, else leave it as empty string.

                Return a python dictionary, contained in a list in the following format, in which double quotes are used: 
                Combined list: [{"name": , "description":, "budget": "openingHours": , "website":}]"""



def get_llama_shopping(city, country, pre_prompt=pre_prompt, prompt_input=prompt_input):
    site = get_lonelyplanet_url(city, country)

    prompt_input = prompt_input % (site, city, country) 

    result = ""

    try:
        for event in replicate.stream(
        "meta/meta-llama-3-8b-instruct",
        input={
            "seed": 2,
            "top_k": 0,
            "top_p": 0.95,
            "prompt": prompt_input,
            "max_tokens": 1000,
            "temperature": 0.7,
            "system_prompt": pre_prompt,
            "length_penalty": 0.7,
            "max_new_tokens": 1000,
            "stop_sequences": "<|end_of_text|>,<|eot_id|>",
            "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
            "presence_penalty": 0,
            "log_performance_metrics": False
        },
        ):
            # print(str(event), end="")
            result += str(event)

        # print(result)

        # find where the first "[....]"
        try:
            index_start = result.find('[')
            index_end = result.find(']')
            result = result[index_start:index_end+1].strip()

            # print(result)

            # formatting it as json
            shopping_list = json.loads(result)
            # add image url
            if shopping_list:
                return get_bing_images(shopping_list, city, country)
        except:
                return ["Error, failed to format the prompt"]
        

    except:
        # if error
        print("Failed to generate any prompt")
        return ["Error, failed to generate any prompt"]
    

# loops through any form of data from llama api and gives images
def get_bing_images(data, city, country):
    if data:
        search_url = "https://api.bing.microsoft.com/v7.0/images/search"
        headers = {"Ocp-Apim-Subscription-Key": BING_SUBSCRIPTION_KEY}

        for d in data:
            # d is a dictionary with {"name": , "description":, "budget":}
            search_term = d.get("name") + " ambience in {} {}".format(city, country)
            if search_term:
                params = {"q": search_term, "imageType": "photo"}  ##ADD IMAGE SIZE?

            try:
                # get images
                response = requests.get(search_url, headers=headers, params=params)
                response.raise_for_status()
                search_results = response.json()
                thumbnail_urls = [img["contentUrl"] for img in search_results["value"][:1]] # only retrieve the first one # contentUrl
                d["imageURL"] = thumbnail_urls[0]

                # get geolocation
                location, place_id = get_location(d.get("name"), city, country)
                if location:
                    d["latitude"] = location.get("lat")
                    d["longitude"] = location.get("lng")

                    # update website if needed, ie: when llama has no website given
                    d["place_id"] = location.get("place_id")
                    if d.get("website") == "" or d.get("website") == None:
                        google_website = get_website(place_id)
                        if google_website:
                            d["website"] = google_website
            
            except requests.HTTPError as e:
                print(e)
                d["imageURL"] = None

        return data

#####################
# city, country = "Cairo", "Egypt"
# city, country = "Singapore", "Singapore"
# city, country = "Sydney", "Australia"

# budget = "low"
# budget = "medium"
# budget = "high"

# print(get_llama_shopping(city, country))

### for bing query images
# data = [{'name': 'Citystars Mall', 'description': "Located in the Heliopolis district, Citystars Mall is one of the largest shopping centers in Egypt. It features a wide range of luxury brands such as Louis Vuitton, Gucci, and Chanel, as well as local brands like Cotton Club and La Marquise. The mall also has an IMAX theater, a bowling alley, and a kids' play area.", 'imageURL': ['https://media-cdn.tripadvisor.com/media/photo-s/01/19/60/5a/caption.jpg']}, {'name': 'Cairo Festival City Mall', 'description': 'Situated in the Nasr City district, Cairo Festival City Mall is a popular destination for shopping and entertainment. It features a mix of local and international brands like Zara, H&M, and Marks & Spencer, as well as Egyptian brands like Maison Thomas and Hoss Intezar. The mall also has a cinema complex, an ice skating rink, and a games area.', 'imageURL': ['https://media-cdn.tripadvisor.com/media/photo-s/1a/d5/e4/28/restaurant-s-interior.jpg']}, {'name': 'The Mall of Egypt', 'description': 'Located in the 6th of October City, The Mall of Egypt is a modern shopping destination that features a mix of local and international brands. It has a large food court, a cinema complex, and an amusement park with rides and games. Some of the luxury brands available include Cartier, Tiffany & Co., and Hermès.', 'imageURL': ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/6b/8e/fa/caption.jpg?w=1200&h=-1&s=1']}, {'name': 'Khan el-Khalili', 'description': "Khan el-Khalili is one of the oldest and most famous bazaars in the Middle East. It's a great place to find unique souvenirs, traditional clothing, and local handicrafts. The bazaar is filled with the sounds of merchants calling out their wares and the smells of spices and coffee.", 'imageURL': ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/34/c6/07/khan-al-khalili.jpg?w=1200&h=1200&s=1']}, {'name': 'AUC New Campus', 'description': "The American University in Cairo's (AUC) new campus has a small shopping area with a mix of local and international brands. It's a great place to find gifts, souvenirs, and everyday items. The campus also has a food court and a few restaurants.", 'imageURL': ['https://media-cdn.tripadvisor.com/media/photo-s/1a/fb/9c/09/brunch.jpg']}, {'name': 'The Gate of Cairo', 'description': 'Located in the Maadi district, The Gate of Cairo is a modern shopping center that features a mix of local and international brands. It has a large food court, a cinema complex, and a games area. Some of the luxury brands available include Swarovski and Fossil.', 'imageURL': ['https://media-cdn.tripadvisor.com/media/photo-s/21/99/3a/6d/generic-shot.jpg']}, {'name': 'Maadi Mall', 'description': 'Maadi Mall is a popular shopping destination in the Maadi district. It features a mix of local and international brands like Zara, H&M, and Marks & Spencer, as well as Egyptian brands like Maison Thomas and Hoss Intezar. The mall also has a cinema complex and a food court.', 'imageURL': ['https://media-cdn.tripadvisor.com/media/daodao/photo-s/0e/26/01/77/caption.jpg']}, {'name': 'Point 90', 'description': "Point 90 is a shopping and entertainment complex located in the Heliopolis district. It features a mix of local and international brands, as well as a cinema complex, a bowling alley, and a kids' play area.", 'imageURL': ['https://media-cdn.tripadvisor.com/media/photo-s/14/4e/ec/84/ta-img-20180825-171417.jpg']}, {'name': 'Azbakeya Mall', 'description': 'Azbakeya Mall is a small shopping center located in the Azbakeya district. It features a mix of local and international brands, as well as a food court and a few restaurants. The mall is a great place to find everyday items and gifts.', 'imageURL': ['https://media-cdn.tripadvisor.com/media/photo-s/15/07/7f/a5/20181013-150521-largejpg.jpg']}]
# print (get_bing_images(data, city, country))