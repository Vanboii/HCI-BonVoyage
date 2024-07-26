from dotenv import load_dotenv # obtains information inside .ini or .env
import os
import replicate
import ast

# admin configuation 
load_dotenv()
REPLICATE_API_TOKEN = os.environ['REPLICATE_API_TOKEN']


# prompt generation
pre_prompt = """You are a helpful, respectful and honest assistant. 
                Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
                Please ensure that your responses are socially unbiased and positive in nature.
                Return a python dictionary in the following format: {\'categories\': [list of potential categories]}"""

prompt_input = """Can you categorise %s, %s as one of the following:
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
                    - Night-life

                Once you categorised it, you only need to return the activities that exist in the city.
                You do not need to explain or give examples. 
                For instance, if the city does not have Amusement Parks, then exclude it from the list. 
                If the city is known for Shopping instead, then include it in a list of potential {catgeogries: \'categories\': [list of potential categories]} as output."""


# to double check formatting for those with spaces
actual_list = {"Amusement": "Amusement Park",
               "Parks": "Parks & Scenic Place",
                "Parks&": "Parks & Scenic Place",
                "Theatre": "Theatre & Cultural",
                "Theatre&": "Theatre & Cultural",
                "HistoricalSite": "Historical Site",
                "FoodGalore": "Food Galore"}


# getting the response
def generate_activities(city, country, prompt_input=prompt_input, actual_list=actual_list):
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
            

#############################################################
# print(generate_activities("Amsterdam", "Netherlands"))
# print(generate_activities("Jakarta", "Indonesia"))
# print(generate_activities("Sydney", "Australia"))

# This function returns:
# {'categories': ['Kid-friendly', 'Pet-friendly', 
#                   'Wheelchair-friendly', 'Shopping', 
#                   'Museum', 'Parks & Scenic Place', 'Theatre & Cultural', 
#                   'Historical Site', 'Food Galore']}
