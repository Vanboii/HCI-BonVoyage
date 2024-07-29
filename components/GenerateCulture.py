from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import replicate
import json
import requests


# admin configuation 
load_dotenv()
REPLICATE_API_TOKEN = os.environ['REPLICATE_API_TOKEN']
BING_SUBSCRIPTION_KEY = os.environ['BING_SUBSCRIPTION_KEY']


# URL/references
def get_lonelyplanet_url(city, country):
    link1 = "https://www.lonelyplanet.com/{}/{}"
    link2 = "https://www.lonelyplanet.com/{}/{}/{}"
    country = country.lower()
    city = city.lower()
    
    if country == city:
        return link1.format(country, "entertainment")
    return link2.format(country, city, "entertainment")


def get_tag(activities):
    #activities = ["Museum", "Historical Site", "Kid-friendly", "Wheelchair-friendly"]
    # any terms with "friendly" will always be attached to the attraction
    tag = ""
    if "Kid-friendly" in activities:
        tag += "Kid-friendly,"
        activities.remove("Kid-friendly")
    elif "Wheelchair-friendly" in activities:
        tag += "Wheelchair-friendly,"
        activities.remove("Wheelchair-friendly")
    elif "Pet-friendly" in activities:
        tag += "Pet-friendly,"
        activities.remove("Pet-friendly")

    return tag
    


# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                Return a python dictionary, contained in a list in the following format: 
                Combined list: [{destination 1 name: "", destination 1 description: "", "destination 1 budget": ""}, 
                                {"destination 2 name": "", "destination 2 description": "", "destination 2  budget": ""}]"""


prompt_input = """Summarise this website %s

                If the url is invalid, you are free to give alternatives from the internet, especially from local blogs as long as it is in %s, %s.

                Give me a list of 9 location, if you can, along with 2-3 sentences of description for each location. The location given should fit within a %s budget.
                The following locations could be classified under %s.

                The description could entail about the overall vibe of the location and a fun or historical  fact as to why people should visit the place.

                Please also give a budget range if possible that is within a price range in USD. Else infer from it and give it a "low", "medium" or "high"

                Return a python dictionary, contained in a list in the following format, in which double qotes are used: 
                Combined list: [{"name": , "description": ,"budget":}]"""



def get_llama_culture(city, country, budget, activities, pre_prompt=pre_prompt, prompt_input=prompt_input):
    site = get_lonelyplanet_url(city, country)
    tag = get_tag(activities)
    recommendation_list = []


    prompt_input_updated = prompt_input % (site, city, country, budget, "Theatre & Cultural "+tag) 

    result = ""

    try:
        for event in replicate.stream(
        "meta/meta-llama-3-8b-instruct",
        input={
            "seed": 2,
            "top_k": 0,
            "top_p": 0.95,
            "prompt": prompt_input_updated,
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
        result = json.loads(result)
        # add image url
        if result:
            recommendation_list.extend(get_bing_images(result, city, country))
        else:
            return ["Error, failed to format the prompt"]
            

    except:
        # if error
        print("Failed to generate any prompt")
        return ["Error, failed to generate any prompt"]
        
    # if successful, it should be filled
    return recommendation_list
    

# loops through any form of data from llama api and gives images
def get_bing_images(data, city, country):
    if data:
        search_url = "https://api.bing.microsoft.com/v7.0/images/search"
        headers = {"Ocp-Apim-Subscription-Key": BING_SUBSCRIPTION_KEY}

        for d in data:
            # d is a dictionary with {"name": , "description":, "budget":}
            search_term = d.get("name") + " vibrant scenic place in {} {}".format(city, country)
            if search_term:
                params = {"q": search_term, "imageType": "photo"}  ##ADD IMAGE SIZE?

            try:
                response = requests.get(search_url, headers=headers, params=params)
                response.raise_for_status()
                search_results = response.json()
                thumbnail_urls = [img["contentUrl"] for img in search_results["value"][:1]] # only retrieve the first one # contentUrl
                d["imageURL"] = thumbnail_urls[0]
            
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

# activities = ["Historical Site", "Amusement Park"] Theatre & Cultural
# activities = ["Museum", "Theatre & Cultural", "Wheelchair-friendly"]

# activities, tag = get_tag(activities)
# print(activities, tag)

# print(get_llama_culture(city, country, budget, activities))

### for bing query images
# data = [{'name': 'Pyramid of Khafre', 'description': "The Pyramid of Khafre is one of the most iconic landmarks in Cairo and offers stunning views of the city. Visitors can explore the pyramid's inner chambers and learn about its history.", 'budget': 'medium', 'imageURL': 'https://c8.alamy.com/comp/2AEFGBY/pyramid-of-khafre-cairo-egypt-2AEFGBY.jpg'}, {'name': 'The Egyptian Museum', 'description': "Home to the world's largest collection of ancient Egyptian artifacts, the Egyptian Museum is a must-visit for history buffs. The museum's vast collection includes mummies, sarcophagi, and other treasures.", 'budget': 'low', 'imageURL': 'https://images.squarespace-cdn.com/content/v1/56c13cc00442627a08632989/1585432288121-15NNGMB5XEP5CJ1YSGL3/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/egyptianmuseum.jpg'}, {'name': 'Islamic Cairo', 'description': 'Islamic Cairo is a historic neighborhood filled with mosques, madrasas, and other Islamic landmarks. Visitors can explore the narrow streets and take in the vibrant atmosphere.', 'budget': 'medium', 'imageURL': 'https://www.egypttoursportal.co.uk/wp-content/uploads/2020/05/Islamic-Cairo-Egypt-Tours-Portal.jpg'}, {'name': 'Al-Azhar Mosque', 'description': 'One of the oldest and most beautiful mosques in Cairo, Al-Azhar Mosque is a stunning example of Islamic architecture. Visitors can take a guided tour and learn about its history.', 'budget': 'medium', 'imageURL': 'https://www.tripsavvy.com/thmb/xvH91GQ2VaL9VQGFowLpor57QGQ=/3783x2465/filters:fill(auto,1)/GettyImages-175839740-58c15dcc3df78c353cec3e37.jpg'}, {'name': 'The Citadel of Cairo', 'description': "The Citadel of Cairo is a medieval Islamic fortification that offers stunning views of the city. Visitors can explore the fort's ramparts, towers, and mosques.", 'budget': 'medium', 'imageURL': 'https://www.tripsavvy.com/thmb/dohwmuJLYDSXWMWbDbv8_0eqHHk=/2121x1414/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-542698921-5b43665246e0fb0037d62e97.jpg'}, {'name': 'Tahrir Square', 'description': 'The site of the Egyptian Revolution in 2011, Tahrir Square is a bustling public space filled with street vendors, cafes, and historic landmarks. Visitors can take a stroll and soak up the atmosphere.', 'budget': 'low', 'imageURL': 'https://c8.alamy.com/comp/2RYK11P/obelisk-and-buildings-of-the-tahrir-square-popular-landmark-in-the-centre-of-cairo-egypt-2RYK11P.jpg'}, {'name': 'The Khan el-Khalili Market', 'description': 'One of the oldest and most famous bazaars in the Middle East, the Khan el-Khalili Market is a treasure trove of spices, perfumes, and souvenirs. Visitors can haggle for prices and take in the vibrant atmosphere.', 'budget': 'low', 'imageURL': 'https://www.egyptconnection.com/wp-content/uploads/2019/12/Khan-El-Khalili-Bazaar-Cairo-Egypt-1.jpg'}, {'name': 'The Hanging Church', 'description': 'One of the oldest churches in Egypt, the Hanging Church is a stunning example of Coptic architecture. Visitors can take a guided tour and learn about its history.', 'budget': 'medium', 'imageURL': 'https://fthmb.tqn.com/mrstbq38STvEUD9izJi77qyHr1A=/960x0/filters:no_upscale()/GettyImages-636039202-58a573a45f9b58a3c94c5b55.jpg'}, {'name': 'The Church of St. Sergius', 'description': 'A historic church located in the Coptic Cairo neighborhood, the Church of St. Sergius is a stunning example of Coptic architecture. Visitors can take a guided tour and learn about its history.', 'budget': 'medium', 'imageURL': 'https://jakadatoursegypt.com/wp-content/uploads/2020/12/Church-of-St.-Sergius.jpg'}, {'name': 'Cairo Tower', 'description': 'For a panoramic view of the city, head to the Cairo Tower, which stands 187 meters tall. You can enjoy a meal or snack at the revolving restaurant on the top floor.', 'budget': 'medium', 'imageURL': 'https://c8.alamy.com/comp/GD2CP5/egyptian-landmark-of-cairo-tower-over-blue-sky-GD2CP5.jpg'}, {'name': 'Egyptian Museum', 'description': "Home to the world's largest collection of ancient Egyptian artifacts, including mummies and sarcophagi. A must-visit for history buffs and archaeology enthusiasts.", 'budget': 'low', 'imageURL': 'https://images.squarespace-cdn.com/content/v1/56c13cc00442627a08632989/1585432288121-15NNGMB5XEP5CJ1YSGL3/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/egyptianmuseum.jpg'}, {'name': 'Islamic Cairo', 'description': "Explore the historic Islamic Cairo neighborhood, which is home to some of the city's most beautiful mosques, madrasas, and bazaars.", 'budget': 'low', 'imageURL': 'https://www.egypttoursportal.co.uk/wp-content/uploads/2020/05/Islamic-Cairo-Egypt-Tours-Portal.jpg'}, {'name': 'Nile River', 'description': 'Take a stroll along the Nile River and enjoy the views of the city skyline. You can also take a felucca ride or a dinner cruise.', 'budget': 'low', 'imageURL': 'https://www.tripsavvy.com/thmb/FxPcK6mdg79ZaPDqDiTh9QovTok=/2121x1414/filters:fill(auto,1)/GettyImages-96869652-f6700d0efa8c4efb8031043af8ccaf8e.jpg'}, {'name': 'Khan el-Khalili', 'description': 'One of the oldest and most famous bazaars in the Middle East, Khan el-Khalili is a treasure trove of souvenirs, spices, and handicrafts.', 'budget': 'low', 'imageURL': 'https://prd-webrepository.firabarcelona.com/wp-content/uploads/sites/69/2023/04/14175713/istock-992735534-scaled.jpg'}, {'name': 'Pyramids of Giza', 'description': 'A must-visit attraction in Cairo, the Pyramids of Giza are an absolute wonder of the ancient world. Take a guided tour or explore on your own.', 'budget': 'medium', 'imageURL': 'https://www.tripsavvy.com/thmb/Ue5Tz-4fTb9OTBbEzBxlqa8UT_s=/2143x1399/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-154260931-584169ec3df78c0230514c82.jpg'}, {'name': 'Museum of Egyptian Antiquities', 'description': 'This museum is home to a vast collection of ancient Egyptian artifacts, including mummies, sarcophagi, and temple reliefs.', 'budget': 'low', 'imageURL': 'https://thumbs.dreamstime.com/z/museum-egyptian-antiquities-cairo-egypt-may-which-houses-world-s-largest-collection-ancient-capital-179258803.jpg'}, {'name': 'Al-Azhar Park', 'description': 'A beautiful park in the heart of Islamic Cairo, Al-Azhar Park offers stunning views of the city and is a great place to relax.', 'budget': 'low', 'imageURL': 'https://www.tripsinegypt.co.uk/wp-content/uploads/2023/02/al-azhar-park-trips-in-egypt.jpg'}, {'name': 'Tahrir Square', 'description': 'The heart of modern Cairo, Tahrir Square is a bustling hub of activity, with street performers, vendors, and cafes.', 'budget': 'low', 'imageURL': 'https://c8.alamy.com/comp/2RYK11P/obelisk-and-buildings-of-the-tahrir-square-popular-landmark-in-the-centre-of-cairo-egypt-2RYK11P.jpg'}]
# print (get_bing_images(data, city, country))