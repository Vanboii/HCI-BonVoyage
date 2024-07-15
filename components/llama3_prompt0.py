from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import requests
import replicate


# self-defined libraries
from localhash.hash_countrycode import convert_to_countrycode


# admin configuation 
load_dotenv()
replicate_api_token = os.environ['replicate_api_token']

# function to check if it is safe to travel or not
def check_safety(country):
    countrycode = convert_to_countrycode(country.title())
    travel_advisory_url = "https://www.travel-advisory.info/api?countrycode={}".format(countrycode)
    response = requests.get(travel_advisory_url)

    # Process the JSON data
    if response.status_code == 200:
        json_data = response.json()
        safety_index = json_data["data"][countrycode]["advisory"]["score"]
        if safety_index >= 4.5:
            return (["unsafe", json_data["data"][countrycode]["advisory"]["message"]]) # returns ["unsafe", safety msg]
        else:
            return (["safe"])
    else:
        print(f"Error fetching data (status code {response.status_code})")
        return(["error", f"Error fetching data (status code {response.status_code})"])


# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                """


# getting the response
def generate_recommendation(city, country):

    # Check if it is generally safe in the country
    ###
    # risk value of 4.5-5: Avoid any trips
    # risk value of 3.5-4.5: Reduce travel to bare minimum, conduct any travels with good preparation and high attention
    # risk value of 2.5-3.5: Warnings relate to specific regions of the country, still advised to remain vigilant
    # risk value of 0-2.5: Relatively safe
    ###
    travel_advisory = check_safety(country) # returns ["safe/unsafe/error", msg]
    # if its unsafe or server error return status immediately
    if travel_advisory[0] != "safe":
        return {"status": travel_advisory[0],
                "reply": travel_advisory[1]}


    # Else proceed to llama API

    # Outputs which of the 10 categories are possible in the country
    prompt_input = """Can you categorise {}, {} as one of the following:
                        - Kid friendly
                        - Pet friendly
                        - Wheelchair friendly
                        - Shopping
                        - Amusement parks
                        - Museums
                        - Parks and scenic place
                        - Theatre & Cultural activities
                        - Historical sites
                        - Food galore

                        Once you categorised it, you only need to return the activities that exist in the city.
                        You do not need to explain or give examples. 
                        For instance, if London does not have Amusement Parks, then exclude it from the list. 
                        If London is known for Shopping instead, then include it in a list of "Confirmed categories: Shopping...." as output.
                        """.format(city, country)

    response = replicate.run(
        "meta/llama-2-13b-chat",
        input={
            "seed": 2,
            "top_k": 0,
            "top_p": 1,
            "prompt": prompt_input,
            "max_tokens": 500,  # decrease this to generate less texts
            "temperature": 0.25,
            "system_prompt": pre_prompt,
            "length_penalty": 0.5,
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
    def format_0(full_response):
        for item in full_response.split("\n\n"):
            if "*" in item: # they would be given in a "* Place - Description" format
                item = item.split("\n*")
                break

        for i in range(len(item)):
            item[i] = item[i].replace("*", "").strip()

        return {"activities": item}
            
    return format_0(full_response)
            

#############################################################
print(generate_recommendation("London", "United Kingdom"))

# This function returns:
# {'activities': ['Kid friendly', 'Pet friendly', 
#                 'Wheelchair friendly', 'Shopping', 
#                 'Museums', 'Parks and scenic plane', 
#                 'Theatre & Cultural activities', 'Historical sites', 
#                 'Food galore']}