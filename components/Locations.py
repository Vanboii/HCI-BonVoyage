from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import replicate
import ast


# admin configuation 
load_dotenv()
BING_SUBSCRIPTION_KEY = os.environ['BING_SUBSCRIPTION_KEY']
REPLICATE_API_TOKEN = os.environ['REPLICATE_API_TOKEN']


# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                Return a python list in the following format: [list of potential categories]"""


prompt_input = """Summarise this website(s) {}
                And give me a list of at most 9 locations that are {}
                Return a python list in the following format: 
                Combined list: [destination 1, destination 2, destination 3]

                Return a list ['error, no page found'] if the url given does not work"""


def summary(pre_prompt=pre_prompt, prompt_input=prompt_input):
    # Outputs individual places with description
    # If country is safe, proceed to llama API

    # Outputs which of the 10 categories are possible in the country
    prompt_input = prompt_input % (city, country)
    result = ""

    try:
        for event in replicate.stream(
            "meta/meta-llama-3-8b-instruct",
            input={
                "seed": 2,
                "top_k": 0,
                "top_p": 0.95,
                "prompt": prompt_input,
                "max_tokens": 500,  # decrease this to generate less texts
                "temperature": 0.7,
                "system_prompt": pre_prompt,
                "length_penalty": 1,
                "stop_sequences": "<|end_of_text|>,<|eot_id|>",
                "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
                "presence_penalty": 0,
                "log_performance_metrics": False
            },
        ):
            # raw output:
            # print(str(event))

            result += str(event).strip()
        
        # format it in suitable dict/json
        start = result.find("{")
        end = result.find("}")
        result = ast.literal_eval(result[start:end+1])

        # fix formatting once more to add proper spacing
        content = result["categories"]
        print(content)
        for i in range (len(content)):
            if actual_list.get(content[i]):
                content[i] = actual_list.get(content[i])
                print(actual_list.get(content[i]))
                #print(content)

        result["categories"] = content

        return result
    
    except:
        return None




# declaring bing end-point for bing search for photos
def get_images_for(search_term):
    search_url = "https://api.bing.microsoft.com/v7.0/images/search"

    headers = {"Ocp-Apim-Subscription-Key": BING_SUBSCRIPTION_KEY}
    params = {"q": search_term, "license": "Public", "imageType": "photo"}  ##ADD IMAGE SIZE?

    try:
        response = requests.get(search_url, headers=headers, params=params)
        response.raise_for_status()
        search_results = response.json()
        thumbnail_urls = [img["contentUrl"] for img in search_results["value"][:1]] # only retrieve the first one # contentUrl
        return thumbnail_urls
    except requests.HTTPError as e:
        #429 Client Error: Too Many Requests for url
        if e.response.status_code == 429:
            pass



# getting the response
def generate_location_recommendation(chosen_acitivities_json):

    locations_recommendations = [] # stores {index: {location name: name, description: descripton, img url: img url}}
    places_list = [] # stores indv places to prevent repeats
    length = 0

    # get a list of url recommendations from bing
    locations_recommendations_url = create_search_term_recommendations(chosen_acitivities_json)

    # for every url generated, summarise it
    for url in locations_recommendations_url:
        # summary(url) gives us: ['* The British Museum - explore ancient civilizations through interactive exhibits and artifacts', ' The Natural History Museum - discover dinosaurs, fossils, and the natural world through interactive exhibits and displays']
        summary_list = summary(url)

        # unpack the summary list and format it into a dictionary
        # query an image
        for loc in summary_list:
            loc = loc.split("-")
            location = loc[0].replace("*", "").strip()
            description = loc[1].replace(".", "").strip()
            description = description[0].upper() + description[1:]

            img_url = get_images_for(location)
            # due to errors, remove img so it wont be None
            if img_url != None:
                # if it is not in the placeholder, create a json and store it,
                # else, discard repeated locations
                if location not in places_list:
                    locations_recommendations.append({"location": location, #"index": length, 
                                                    "description": description,
                                                    "image_url": img_url})
                    places_list.append(location)
                    length += 1

    # print(places_list)
    return({"length": length, 
            "data": locations_recommendations})
           


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