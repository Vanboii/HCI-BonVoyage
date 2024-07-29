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
        # geometry = response.get("results")[0].get("geometry")
        # lat = geometry.get('location').get('lat')
        # lng = geometry.get('location').get('lng')
        return response.get("results")[0].get("geometry").get("location")

    else:
        print("error in google maps api")
        return None


# URL/references
def get_lonelyplanet_url(city, country):
    link1 = "https://www.lonelyplanet.com/{}/{}"
    link2 = "https://www.lonelyplanet.com/{}/{}/{}"
    country = country.lower()
    city = city.lower()
    
    if country == city:
        return link1.format(country, "restaurants")
    return link2.format(country, city, "restaurants")
    


# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                Return a python dictionary, contained in a list in the following format: 
                Combined list: [{destination 1 name: "", destination 1 description: "", "destination 1 budget": ""}, 
                                {"destination 2 name": "", "destination 2 description": "", "destination 2  budget": ""}]"""


prompt_input = """Summarise this website %s

                If the url is invalid, you are free to give alternatives from the internet, especially from local blogs as long as it is in %s, %s.

                Give me a list of 9 restaurant, if you can, along with 2-3 sentences of description for each restaurant. The restaurants given should fit within a %s budget.
                Do not recommend restaurants that are unfit for my %s dietary restrictions (if any).

                The description could entail about the dish they are well known for. It could also be about the restaurant's historical significance or a fun fact and why people should eat there.

                Please also give a budget range if possible that is within a price range in USD. Else infer from it and give it a "low", "medium" or "high"

                Return a python dictionary, contained in a list in the following format: 
                Combined list: [{destination 1 name: "", destination 1 description: "", "destination 1 budget": ""}, {"destination 2 name": "", "destination 2 description": "", "destination 2  budget": ""}]"""



def get_llama_foodgalore(city, country, budget, dietary_restrictions, pre_prompt=pre_prompt, prompt_input=prompt_input):
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
            "max_tokens": 900,
            "temperature": 0.7,
            "system_prompt": pre_prompt,
            "length_penalty": 0.7,
            "max_new_tokens": 900,
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
        restaurant_list = json.loads(result)
        # add image url
        if restaurant_list:
            return get_bing_images(restaurant_list, city, country)
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
            search_term = d.get("name") + " restaurant ambience in {} {} site: tripadvisor.com".format(city, country)
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
                location = get_location(d.get("name"), city, country)
                if location:
                    d["location"] = location
            
            except requests.HTTPError as e:
                print(e)
                d["imageURL"] = None
                #429 Client Error: Too Many Requests for url
                # if e.response.status_code == 429:
                #     pass

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

# print(get_llama_foodgalore(city, country, budget, dietary_restrictions))

### for bing query images
# data = [{'name': 'Koshari Abou Tarek', 'description': "This casual eatery is famous for its koshari, a popular Egyptian dish made with pasta, lentils, tomato sauce, and fried onions. It's a must-try when in Cairo.", 'budget': 'medium', 'imageURL': ['https://4.bp.blogspot.com/-hRO0diZIjBU/WkXUY6p8Q9I/AAAAAAACMtI/ZHTgO4iph1QvGeFY6c14TJo8fpoGBUadQCLcBGAs/s1600/L1180999-001.jpg']}, {'name': 'Abou El Sid', 'description': 'This cozy restaurant serves traditional Egyptian cuisine with a modern twist. Try their famous mahshi (stuffed grape leaves) and falafel.', 'budget': 'medium', 'imageURL': ['https://www.alamy.com/aggregator-api/download?url=https://c8.alamy.com/comp/B5A7NB/the-bar-in-abou-el-sid-restaurant-located-in-zamalek-district-on-the-B5A7NB.jpg']}, {'name': 'Lebanese House', 'description': 'This family-run restaurant offers a wide range of Lebanese and Middle Eastern dishes. Their shawarma and kebabs are highly recommended.', 'budget': 'medium', 'imageURL': ['https://i.pinimg.com/originals/ec/9d/3d/ec9d3d43619430c08d2af36536e56f25.jpg']}, {'name': 'Café Riche', 'description': "This historic café has been a Cairo institution since 1908. It's a great place to try traditional Egyptian coffee and pastries.", 'budget': 'low', 'imageURL': ['http://inspiration.rehlat.com/wp-content/uploads/2019/08/Cafe-Riche-newsweek.jpg']}, {'name': 'Mama Shoula', 'description': 'This popular restaurant serves a variety of Egyptian and international dishes. Try their famous shawarma and Egyptian-style pizza.', 'budget': 'medium', 'imageURL': ['https://assets.cairo360.com/app/uploads/2018/09/8034B-2PPFILTER-1.jpg']}, {'name': 'El Fishawy', 'description': 'This casual eatery is famous for its traditional Egyptian street food, including falafel, koshari, and shawarma.', 'budget': 'low', 'imageURL': ['https://c8.alamy.com/comp/C746DN/famous-el-fishawy-cafe-in-cairo-souk-egypt-C746DN.jpg']}, {'name': 'Zamalek Fish Market', 'description': 'This seafood restaurant offers a wide range of fresh fish dishes. Try their grilled fish and seafood platters.', 'budget': 'medium', 'imageURL': ['https://assets.cairo360.com/app/uploads/2023/09/03/Snapinsta.app_369973170_320203407121288_5514185405957238898_n_1080-612x226.jpg']}, {'name': 'Bistro 33', 'description': 'This trendy bistro serves a mix of international and Egyptian dishes. Try their famous burgers and salads.', 'budget': 'medium', 'imageURL': ['https://10619-2.s.cdn12.com/rests/small/w550/h367/410_503505138.jpg']}, {'name': 'Wahab', 'description': 'This popular restaurant serves traditional Egyptian cuisine with a modern twist. Try their famous koshari and shawarma.', 'budget': 'medium', 'imageURL': ['https://assets.cairo360.com/app/uploads/2014/02/article_original_6692_20140217_530221e9b9682-675x323.jpg']}]
# print (get_bing_images(data, city, country))