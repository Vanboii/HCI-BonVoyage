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
        print("error in google maps api")
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
        return link1.format(country, "nightlife")
    return link2.format(country, city, "nightlife")



# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                Return a python dictionary, contained in a list in the following format: 
                Combined list: [{destination 1 name: "", destination 1 description: "", "destination 1 budget": "", "destination 1 openingHours": "", "destination 1 website": ""}, 
                                {"destination 2 name": "", "destination 2 description": "", "destination 2  budget": "", "destination 2 openingHours": "", "destination 2 website": ""}]"""


prompt_input = """Summarise this website %s

                If the url is invalid, you are free to give alternatives from the internet, especially from local blogs as long as it is in %s, %s.

                Give me a list of 9 location, if you can, along with 2-3 sentences of description for each location. The location given should fit within a %s budget.
                Do not recommend location that are unfit for my %s dietary restrictions (if any).

                The description could entail about the overall vibe of the location and the genres played, if possible. For instance, it is a high-energy nightclub or a cozy jazz club. And whether they can order a cocktail or a street food if it is a night market.

                Please also give a budget range if possible that is within a price range in USD. Else infer from it and give it a "low", "medium" or "high".
                As well as its opening hours and its website, if it exists, else leave it as empty string.

                Return a python dictionary, contained in a list in the following format, in which double quotes are used: 
                Combined list: [{"name": , "description": ,"budget":, "openingHours":, "website":}]"""



def get_llama_nightlife(city, country, budget, dietary_restrictions, pre_prompt=pre_prompt, prompt_input=prompt_input):
    site = get_lonelyplanet_url(city, country)

    prompt_input = prompt_input % (site, city, country, budget, dietary_restrictions) 

    result = ""

    try:
        for event in replicate.stream(
        "meta/meta-llama-3-8b-instruct",
        input={
            "seed": 2,
            "top_k": 0,
            "top_p": 0.95,
            "prompt": prompt_input,
            "max_tokens": 1500,
            "temperature": 0.7,
            "system_prompt": pre_prompt,
            "length_penalty": 0.7,
            "max_new_tokens": 1500,
            "stop_sequences": "<|end_of_text|>,<|eot_id|>",
            "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
            "presence_penalty": 0,
            "log_performance_metrics": False
        },
        ):
            # print(str(event), end="")
            result += str(event)

        print(result)

        # find where the first "[....]"
        index_start = result.find('[')
        index_end = result.find(']')
        result = result[index_start:index_end+1].strip()

        # formatting it as json
        nightlife_list = json.loads(result)
        # add image url
        if nightlife_list:
            return get_bing_images(nightlife_list, city, country)
        else:
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
            search_term = d.get("name") + " nightlife vibrant atmosphere in {} {}".format(city, country)
            if search_term:
                params = {"q": search_term, "imageType": "photo"}  ##ADD IMAGE SIZE?

            try:
                # get image
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

# dietary_restrictions = "NIL"
# dietary_restrictions = "Halal"

# print(get_llama_nightlife(city, country, budget, dietary_restrictions))

### for bing query images
# data = [{'name': 'The Tap East', 'description': 'A popular pub with a lively atmosphere, playing a mix of rock, pop, and sports games. They have a wide selection of beers and cocktails.', 'budget': 'medium', 'imageURL': 'https://img.traveltriangle.com/blog/wp-content/uploads/2019/06/The-Tap1-400x246.jpg'}, {'name': 'The Greek Club', 'description': 'A cozy club playing Greek music, with a relaxed atmosphere and a variety of cocktails. They also serve Greek-inspired street food.', 'budget': 'medium', 'imageURL': 'https://scenenow.com/Content/editor_api/images/250660343_609235507106316_7277425122652005439_n-f0f803b8-a7b9-4798-98a3-73f5a5f46531.jpg'}, {'name': 'The Drunken Camel', 'description': 'A laid-back bar with a mix of rock, pop, and indie music, serving a range of beers and cocktails. They also have a selection of pub grub.', 'budget': 'medium', 'imageURL': 'https://egyptianstreets.com/wp-content/uploads/2016/07/IMG_6929.jpg'}, {'name': 'Bierhaus', 'description': 'A German-inspired beer hall with a lively atmosphere, playing rock and pop music. They have a wide selection of beers and sausages.', 'budget': 'medium', 'imageURL': 'https://image.jimcdn.com/app/cms/image/transf/none/path/s5744a0dce02319b4/image/id81c34c378b69f2f/version/1494587002/image.jpg'}, {'name': "The Nile Ritz-Carlton's Zitao", 'description': 'An upscale rooftop bar with stunning views of the Nile, playing a mix of lounge and electronic music. They serve cocktails and canapés.', 'budget': 'high', 'imageURL': 'https://ak-d.tripcdn.com/images/0223r1200084a9zukF79C.jpg'}, {'name': "The Grand Hotel's O Bar", 'description': 'A stylish bar with a sophisticated atmosphere, playing jazz and lounge music. They serve cocktails and canapés.', 'budget': 'high', 'imageURL': 'https://image.jimcdn.com/app/cms/image/transf/none/path/s5744a0dce02319b4/image/id81c34c378b69f2f/version/1494587002/image.jpg'}, {'name': 'The Groove', 'description': 'A popular club playing a mix of hip-hop, R&B, and electronic music, with a high-energy atmosphere. They also have a selection of cocktails.', 'budget': 'medium', 'imageURL': 'http://egyptianstreets.com/wp-content/uploads/2016/07/IMG_6929.jpg'}, {'name': 'Felfela', 'description': 'A lively bar with a mix of rock, pop, and Arabic music, serving a range of beers and cocktails. They also have a selection of street food.', 'budget': 'medium', 'imageURL': 'https://c8.alamy.com/comp/MN93E7/cairo-egypt-felfela-restaurant-highly-popular-restaurant-with-tourists-and-locals-alike-MN93E7.jpg'}, {'name': 'The Irish House', 'description': 'A cozy pub with a relaxed atmosphere, playing a mix of rock, pop, and sports games. They have a wide selection of beers and cocktails, as well as pub grub.', 'budget': 'medium', 'imageURL': 'http://egyptianstreets.com/wp-content/uploads/2016/07/IMG_6929.jpg'}]
# print (get_bing_images(data, city, country))