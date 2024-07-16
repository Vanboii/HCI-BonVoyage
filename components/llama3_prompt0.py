from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import requests
import replicate


# self-defined libraries
from localhash.hash_countrycode import convert_to_countrycode


# admin configuation 
load_dotenv()
REPLICATE_API_TOKEN = os.environ['REPLICATE_API_TOKEN']

# function to check if it is safe to travel or not
def check_safety(country):
    # note that not all countries are accessible
    countrycode = convert_to_countrycode(country.title())

    # if it doesnt exists in travel advisory db, assume no data = safe
    if countrycode == None:
        return (["safe"])

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
                        - Kid-friendly
                        - Pet-friendly
                        - Wheelchair-friendly
                        - Shopping
                        - Amusement Park
                        - Museum
                        - Parks & Scenic Place
                        - Theatre & Cultural
                        - Historical Site
                        - Food Galore

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

    print(full_response.split('\n'))


    # filter through and check if each category exists
    category_activity = ["Kid-friendly", "Pet-friendly", "Wheelchair-friendly",
                        "Shopping", "Amusement Park", "Museum", "Parks & Scenic Place",
                        "Theatre & Cultural", "Historical Site", "Food Galore"]
    


    # formatting 2: only capturing those from "places listed:..." format
    def format_0(full_response):
        for item in full_response.split("\n\n"):
            if "*" in item: # they would be given in a "* Place - Description" format
                item = item.split("\n*")
                break

        for i in range(len(item)):
            item[i] = item[i].replace("*", "").strip()
        return item

    # formatting 2.1: only collect those that are "confirmed categories" up till ""
    def format_1(full_response):
        item = []
        collect = False
        full_response = full_response.split('\n')
        for i in range (len(full_response)):
            # finding the end point
            if collect:
                # this is the response we want
                if "*" in full_response[i]:
                    # we check if a specific keyword exists
                    for cat in category_activity:
                        # if keyword found, append & break
                        if cat in full_response[i]:
                            item.append(cat)
                            break

                # ignore the empty lines
                elif "" == full_response[i]:
                    pass

                # any other lines is the end-point
                else:
                    collect = False
                        

            # finding the start point
            if ("confirmed" in full_response[i]) or ("Confirmed" in full_response[i]) or ("can be categorized" in full_response[i]):
                collect = True
            
        return item

    #json wrapper   
    return {"status": "safe",
            "reply": format_1(full_response)}
            

#############################################################
print(generate_recommendation("London", "United Kingdom"))

# This function returns:
# {'activities': ['Kid friendly', 'Pet friendly', 
#                 'Wheelchair friendly', 'Shopping', 
#                 'Museums', 'Parks and scenic plane', 
#                 'Theatre & Cultural activities', 'Historical sites', 
#                 'Food galore']}
