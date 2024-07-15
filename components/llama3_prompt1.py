from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import requests
import replicate


# admin configuation 
load_dotenv()
subscription_key = os.getenv('subscription_key_search', default='')
replicate_api_token = os.getenv('replicate_api_token')


# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                """


# declaring bing end-point for search
def get_results_for(search_term):
    search_url = "https://api.bing.microsoft.com/v7.0/search"
    headers = {"Ocp-Apim-Subscription-Key": subscription_key}
    params = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}  ##answerCount filter, count?

    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    # we limit our results to first relevant 5 searches
    search_results = response.json()["webPages"]["value"][:5]
    return search_results


# creating a pipeline for quering potential places to show the swipping mechanism
def create_search_term_recommendations(acitivities_json):
    # sites we want to omit as the robustness of data is bad
    omit = ["Tripadvisor"]

    results = []

    # unpacking the activities json to send to API
    category = acitivities_json[0]["category"]
    for index in range(len(category)):
        search_term = "Search for {} places in {} {} on {}".format(category[index], 
                                                                acitivities_json[0]["city"], 
                                                                acitivities_json[0]["country"],
                                                                acitivities_json[0]["month"],)

        bing_results = get_results_for(search_term)

        # process each of the 5 results by:
        for res in bing_results:
            # ensuring that the siteName isn't in the omitted sites
            if res["siteName"] not in omit:
                # serialise it into site-name & url
                #results.append({'siteName': res["siteName"],
                #                'url': res["url"]})
                #results[category[index]] = res["url"]
                results.append(res["url"])
                # only get the first url
                break

    print(results)
    return results


def summary(location_url):
    # Outputs individual places with description
    prompt_input = """Please summarise the following website: 
                    {}
                    Create a combined list of 8 destinations found from the site above.
                    Give a brief description for each destination presented. 
                    It must be in a single line separated by commas. 
                    Format your output in the form of "Places listed: 
                    * place 1 - description of place 1
                    * place 2 - description of place 2
                    * place 3 - description of place 3
                    ...."
                    """.format(location_url)


    response = replicate.run(
        "meta/llama-2-13b-chat",
        input={
            "seed": 2,
            "top_k": 0,
            "top_p": 1,
            "prompt": prompt_input,
            "max_tokens": 612,  # increase this to generate more results  ##SOURCE OF ERROR??
            "temperature": 0.75,
            "system_prompt": pre_prompt,
            "length_penalty": 1,
            "prompt_template": "<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n{prompt} [/INST]",
            "presence_penalty": 0.5,
            "log_performance_metrics": False
        },
    )

    # formatting 1: turning it into a whole paragraph
    full_response = ''
    for item in response:
        full_response += item

    # formatting 2: only capturing those from "places listed:..." format
    def format_2(full_response):
        for item in full_response.split("\n"):
            if "Places listed:" in item:
                return item.strip("Places listed:").split(',')
    #return format_2(full_response)

    # format 3: same as format_2 but to be used with descriptions
    def format_3(full_response):
        for item in full_response.split("\n\n"):
            if "*" in item: # they would be given in a "* Place - Description" format
                #print(item.split("\n*"))
                return item.split("\n*")
            
    print(full_response)
    return format_3(full_response)




# declaring bing end-point for bing search for photos
def get_images_for(search_term):
    search_url = "https://api.bing.microsoft.com/v7.0/images/search"

    headers = {"Ocp-Apim-Subscription-Key": subscription_key}
    params = {"q": search_term, "license": "Public", "imageType": "photo"}  ##ADD IMAGE SIZE?

    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    thumbnail_urls = [img["contentUrl"] for img in search_results["value"][:1]] # only retrieve the first one # contentUrl
    return thumbnail_urls


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

            # if it is not in the placeholder, create a json and store it,
            # else, discard repeated locations
            if location not in places_list:
                locations_recommendations.append({"location": location, #"index": length, 
                                                "description": description,
                                                "image_url": img_url})
                
                length += 1

    return({"length": length, 
            "data": locations_recommendations})
           


#############################################################
# taken from react-server, activities preferences
acitivities_json = [{'country': "United Kingdom",
               'city': "London",
               'category':["Kid friendly", "Shopping", "Wheelchair friendly"],
               'month': "January",
               'budget': "$1000"}] # "Amusement Parks", "Museums"

#locations_recommendations_url = create_search_term_recommendations(acitivities_json)
#print(locations_recommendations_url)

data = generate_location_recommendation(acitivities_json)
print(data)