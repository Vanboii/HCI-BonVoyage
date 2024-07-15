import json

# Load the JSON data from the file
file_path = 'database\gpt.json' 
with open(file_path, 'r') as file:
    data = json.load(file)

# Extract country names and their codes
country_dict = {info["name"]: code for code, info in data["data"].items()}

# Print the dictionary
print(country_dict)
