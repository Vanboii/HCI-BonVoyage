import requests


# self-defined libraries
# from localhash.hash_countrycode import convert_to_countrycode
from hash_countrycode import convert_to_countrycode


# function to check if it is safe to travel or not
def check_safety(country):
    # note that not all countries are accessible
    countrycode = convert_to_countrycode(country.title())

    # if it doesnt exists in travel advisory db, assume no data = safe
    if countrycode == None:
        return ("safe", "")

    travel_advisory_url = "https://www.travel-advisory.info/api?countrycode={}".format(countrycode)
    response = requests.get(travel_advisory_url)

    # Process the JSON data
    if response.status_code == 200:
        json_data = response.json()
        safety_index = json_data["data"][countrycode]["advisory"]["score"]
        if safety_index >= 4.5:
            return ("unsafe", "{} has a high risk level alert. We advise not to travel to {}".format(country, country))
        else:
            return ("safe", "")
    else:
        print(f"Error fetching data (status code {response.status_code})")
        return("error", f"Error fetching data (status code {response.status_code})")


            

#############################################################
# print(check_safety("United Kingdom"))
# print(check_safety("Afghanistan"))


# This function returns:
# (safe, "") or (unsafe, "<message of why is it unsafe>")

###
# risk value of 4.5-5: Avoid any trips
# risk value of 3.5-4.5: Reduce travel to bare minimum, conduct any travels with good preparation and high attention
# risk value of 2.5-3.5: Warnings relate to specific regions of the country, still advised to remain vigilant
# risk value of 0-2.5: Relatively safe
###
