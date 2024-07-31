import pandas as pd
import numpy as np

from sklearn.cluster import KMeans
import scipy



# following google API
# 0 Free
# 1 Inexpensive
# 2 Moderate
# 3 Expensive
# 4 Very Expensive

def custom_budget_mapping(budget_value):
    budget_value = budget_value.lower()

    # custom mapping based on budget levels
    if 'free' in budget_value:
        return 0
    if 'low' in budget_value or 'budget-friendly' in budget_value:
        return 1
    elif 'medium' in budget_value or 'mid-range' in budget_value:
        return 2
    elif 'high' in budget_value or 'luxury' in budget_value:
        return 3
    else:
        # handles $15-$25 signs
        if '-' in budget_value:
            budget_value = budget_value.split('-')
            get_min = int(budget_value[0].replace("$", ''))
        # handles $0 signs
        else:
            get_min = int(budget_value.replace("$", ''))

        if get_min == 0:
            return 0
        elif get_min <= 30:
            return 1
        elif 31 <= get_min <= 100:
            return 2
        elif get_min > 100:
            return 3
        
        return None



def get_cluster(currated_locations, budgetRange):
    # get data from db
    df = pd.DataFrame(currated_locations)

    # simplify the df into the features we want to use
    X = df[["lat", "lng"]]


    # finding the correct number of clusters via the "elbow method"
    max_k = 10
    # iterations
    distortions = [] 
    for i in range(1, max_k+1):
        if len(X) >= i:
            model = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init=10, random_state=0)
            model.fit(X)
            distortions.append(model.inertia_)


    # best k: the lowest derivative => elbow point where the line starts to become straight => the potential number of clusters
    k = [i*100 for i in np.diff(distortions,2)].index(min([i*100 for i 
        in np.diff(distortions,2)]))


    model = KMeans(n_clusters=k, init='k-means++')

    # clustering
    dtf_X = X.copy()
    dtf_X["cluster"] = model.fit_predict(X)


    # find real centroids
    closest, distances = scipy.cluster.vq.vq(model.cluster_centers_, 
                        dtf_X.drop("cluster", axis=1).values)
    dtf_X["centroids"] = 0
    for i in closest:
        dtf_X["centroids"].iloc[i] = 1


    # add clustering info to the original dataset
    df[["cluster","centroids"]] = dtf_X[["cluster","centroids"]]
    df['budgetLabel'] = df['budgetRange'].map(custom_budget_mapping)
    df = df.replace({np.nan: None})

    # return order_cluster(df, k)
    return order_cluster(df, budgetRange)



# def order_cluster(df, k):
#     ordered_clustered = []

#     for i in range(k):
#         filtered_df = df[df['cluster'] == i]
#         row = filtered_df.shape[0]

#         for r in range(row):
#             ordered_clustered.append(filtered_df.iloc[r].to_dict())

#     print(ordered_clustered)
#     return ordered_clustered



def order_cluster(df, budgetRange=1):
    print('budgetRange', budgetRange)

    # filter within budget first => takes priority
    filtered_df = df[df['budgetLabel'] <= budgetRange]

    
    # not within budget
    suggestions_df_budget = df[df['budgetLabel'] >= budgetRange]

    if ('dietaryRestrictions' in df.columns) and ('restrictions' in df.columns):
        priority_df = filtered_df[(filtered_df['dietaryRestrictions'] != None) | (filtered_df['restrictions'] != None)]
        suggestions_df_priority = filtered_df[(filtered_df['dietaryRestrictions'] == None) & (filtered_df['restrictions'] == None)]
        suggestions_df = pd.concat([suggestions_df_priority, suggestions_df_budget], ignore_index=True)
        
    elif 'dietaryRestrictions' in df.columns:
        priority_df = filtered_df[(filtered_df['dietaryRestrictions'] != None)]
        suggestions_df_priority = filtered_df[(filtered_df['dietaryRestrictions'] == None)]
        suggestions_df = pd.concat([suggestions_df_priority, suggestions_df_budget], ignore_index=True)

    elif 'restrictions' in df.columns:
        priority_df = filtered_df[(filtered_df['restrictions'] != None)]
        suggestions_df_priority = filtered_df[(filtered_df['restrictions'] == None)]
        suggestions_df = pd.concat([suggestions_df_priority, suggestions_df_budget], ignore_index=True)

    # currated_locations = pd.concat([filtered_df, suggestions_df_budget], ignore_index=True)
    currated_locations = pd.concat([priority_df, suggestions_df], ignore_index=True)
    currated_locations_dict = currated_locations.to_dict(orient='records')
    # currated_locations_dict = filtered_df.to_dict(orient='records')

    # print(currated_locations_dict)
    return currated_locations_dict # ordered according to priority


def grid_cluster(ordered_clusted, end_day_template, no_days, max_locations):
    if "morning-next-day" not in end_day_template:
        no_days -= 1

    grid = []
    index = len(ordered_clusted) - 1

    for r in range(no_days):
        day = []
        for p in range(3):
            to_put = []
            for m in range(max_locations):
                try:
                    to_put.append(ordered_clusted[index])
                    # print(ordered_clusted[index])
                    index -= 1
                except:
                    pass

            day.append(to_put)
        
        grid.append(day)

    if index > 0:
        suggestion = ordered_clusted[0:index]
    else:
        suggestion = []
    # print('suggestion',suggestion)

    return grid, suggestion



def get_flattened_list(grid):
    array = np.array(grid)
    return array.flatten()


def get_max_locations(travel_stye):
    if travel_stye.get("relaxed") > travel_stye.get("compact"):
        max_locations = 1
    elif travel_stye.get("relaxed") == travel_stye.get("compact"):
        max_locations = 2
    else:
        max_locations = 3
    
    return max_locations



def get_results(currated_locations, no_days, start_day_template, end_day_template, travel_stye, budget_max):

    # rely on budget labels (ingeger) isntead of string
    if 'low' in budget_max:
        budgetRange = custom_budget_mapping('low')
    elif 'medium' in budget_max:
        budgetRange = custom_budget_mapping('medium')
    elif 'high' in budget_max:
        budgetRange = custom_budget_mapping('high')
    else:
        budgetRange = 2 # default medium range

    # print('budgetRange in results', budgetRange)

    # check for the correct number of days
    # if "morning-next-day" not in end_day_template:
        # end_day_template =  {"morning": []}
    # else:
        # no_days -= 1


    # we cluster them first before formatting, followed by putting them in a singular list
    # sorted according to budget, followed by any preferences
    recommendation_list = get_cluster(currated_locations, budgetRange)
    # print(recommendation_list)
    
    
    max_locations = get_max_locations(travel_stye)

    grid, suggestion = grid_cluster(recommendation_list, end_day_template, no_days, max_locations)
    # print(grid)
    
    # create the daily template
    result = {}
    standard_template = {"morning": [], "afternoon": [], "evening": []}
    day_counter = 1

    while (no_days - day_counter) >= 0:
        # we create a template according to the day <no>
        key = "day_" + str(day_counter)

        if day_counter == 1:
            result[key] = start_day_template
        # else its a whole day template
        elif (no_days - day_counter) >= 1:
            result[key] = {"morning": [], "afternoon": [], "evening": []}
        # for final days
        elif (day_counter == no_days):
            if "morning-next-day" in end_day_template:
                result[key] = {"morning": []}
            else:
                result[key] = end_day_template
                
        # for each day, we collect data from the cluster
        print('day', day_counter, 'out of',  no_days)
        print('key:', key)
        print('previous value:', result[key])
        if result[key]:
            p = 0
            # this is for referencing and adding value
            for part in result[key].keys():
                data = grid[day_counter-1][p]
                print(data)
                if data:
                    result[key][part] = data
                    print('added:', data)
                p += 1

        print('new value:', result[key])
        # print('\nResult\n', result)

        day_counter += 1


    # result => "finalised recommendation" + suggestions => flattened remaining grid
    
    return result, suggestion

        


data = [
        {
            "budget": "Low",
            "description": "This island in the Nile River is a popular spot for recreation and relaxation, with plenty of green space, walking trails, and picnic areas. The vibe is peaceful and natural, and visitors can take a leisurely stroll or have a picnic with friends.",
            "imageURL": "https://img.freepik.com/free-photo/view-cairo-tower-gezira-island-nile-egypt_400112-711.jpg?w=1800",
            "lat": 30.0609422,
            "lng": 31.219709,
            "name": "Gezira Island",
            "openingHours": "8:00 AM - 8:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": ""
        },
        {
            "budget": "Mid-range",
            "description": "Heliopolis Mall is a modern shopping mall located in Heliopolis. It features a range of local and international brands, including H&M, Zara, and Apple. The mall also has a variety of dining options and a food court.",
            "imageURL": "https://c8.alamy.com/comp/T8RAP4/atrium-of-city-stars-mall-heliopolis-showing-multi-levels-and-modern-decor-heliopolis-cairo-egypt-T8RAP4.jpg",
            "lat": 30.0444196,
            "lng": 31.2357116,
            "name": "Heliopolis Mall",
            "openingHours": "10:00 AM - 10:00 PM",
            "place_id": None,
            "website": ""
        },
        {
            "budget": "High-end",
            "description": "The Mall of Egypt is a luxurious shopping mall located in 6th October City. It features a range of high-end international brands such as Louis Vuitton, Gucci, and Chanel, as well as local Egyptian brands. The mall also has an IMAX theatre, a virtual reality experience, and a variety of dining options.",
            "imageURL": "https://www.bimcommunity.com/files/images/experiences/Mall-of-Egypt.jpg",
            "lat": 29.97242739999999,
            "lng": 31.0164062,
            "name": "The Mall of Egypt",
            "openingHours": "10:00 AM - 10:00 PM",
            "place_id": None,
            "website": "https://www.mallofegypt.com/"
        },
        {
            "budget": "Low",
            "description": "This popular park is a great place to relax and enjoy the outdoors, with plenty of green space, walking trails, and picnic areas. The vibe is peaceful and natural, and visitors can take a leisurely stroll or have a picnic with friends.",
            "imageURL": "https://www.barcelo.com/guia-turismo/wp-content/uploads/2022/05/el-cairo-dokki-pal.jpg",
            "lat": 30.0382661,
            "lng": 31.2114354,
            "name": "Dokki Park",
            "openingHours": "8:00 AM - 8:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": ""
        },
        {
            "budget": "Low",
            "description": "For a panoramic view of the city, head to the Cairo Tower. The vibe is modern and exciting, and visitors can enjoy a meal at the tower's restaurant or take a ride to the top for a stunning view.",
            "imageURL": "https://www.egypttoursportal.com/images/2021/04/Cairo-Tower-Egypt-Tours-Portal-1.jpg",
            "lat": 30.0459751,
            "lng": 31.2242988,
            "name": "Cairo Tower",
            "openingHours": "9:00 AM - 10:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": "https://www.cairo-tower.com/"
        },
        {
            "budget": "Low",
            "description": "This beautiful mosque is one of the oldest and most important in Cairo, with stunning architecture and intricate tile work. The vibe is peaceful and serene, and visitors can take a guided tour to learn more about its history and significance.",
            "imageURL": "https://www.osiristours.com/wp-content/uploads/2018/11/201803070520052732.jpg",
            "lat": 30.0625176,
            "lng": 31.2380668,
            "name": "Imam Mosque",
            "openingHours": "9:00 AM - 5:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": "https://www.imammosque.com/"
        },
        {
            "budget": "High-end",
            "description": "Cairo Festival City Mall is a luxurious shopping mall located in Nasr City. It features a range of high-end international brands such as Louis Vuitton, Gucci, and Chanel, as well as local Egyptian brands. The mall also has an IMAX theatre and a variety of dining options.",
            "imageURL": "http://gb.gleeds.com/contentassets/72182d734782442b909cbc53d956f99c/cacm0001_n33.jpg",
            "lat": 30.02883619999999,
            "lng": 31.4075861,
            "name": "Cairo Festival City Mall",
            "openingHours": "10:00 AM - 10:00 PM",
            "place_id": None,
            "website": "https://www.cairofestivalcitymall.com/"
        },
        {
            "budget": "Low",
            "description": "This museum showcases the work of Egyptian artists, with a focus on modern and contemporary art. The vibe is creative and inspiring, and visitors can explore exhibits on everything from painting to sculpture.",
            "imageURL": "https://images.squarespace-cdn.com/content/v1/56c13cc00442627a08632989/1585432288121-15NNGMB5XEP5CJ1YSGL3/egyptianmuseum.jpg",
            "lat": 30.043688,
            "lng": 31.2246792,
            "name": "The Egyptian Museum of Modern Art",
            "openingHours": "9:00 AM - 5:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": "https://www.eegyptianmuseum.com/"
        },
        {
            "budget": "Mid-range",
            "description": "The AUC New Campus Mall is a modern shopping mall located on the campus of the American University in Cairo. It features a range of local and international brands, including H&M, Zara, and Apple. The mall also has a variety of dining options and a food court.",
            "imageURL": "https://auctoday.com/wp-content/uploads/2019/02/20170816-_D8E1343.jpg",
            "lat": 30.0192078,
            "lng": 31.5004742,
            "name": "AUC New Campus Mall",
            "openingHours": "10:00 AM - 10:00 PM",
            "place_id": None,
            "website": ""
        },
        {
            "budget": "Mid-range",
            "description": "City Stars Mall is a popular shopping destination in Nasr City. It offers a range of local and international brands, including H&M, Zara, and Adidas. The mall also features a cinema complex, a bowling alley, and a variety of dining options.",
            "imageURL": "https://i.redd.it/vfykp05dedg51.jpg",
            "lat": 30.0729538,
            "lng": 31.3455066,
            "name": "City Stars Mall",
            "openingHours": "10:00 AM - 12:00 AM",
            "place_id": None,
            "website": "https://www.citystarsmall.com/"
        },
        {
            "budget": "Low",
            "description": "One of the Seven Wonders of the Ancient World, the Pyramid of Giza is a must-visit attraction in Cairo. The vibe is historic and awe-inspiring, and visitors can take a guided tour to learn more about its construction and significance.",
            "imageURL": "https://i.natgeofe.com/n/535f3cba-f8bb-4df2-b0c5-aaca16e9ff31/giza-plateau-pyramids.jpg?w=1200",
            "lat": 29.9791705,
            "lng": 31.1342046,
            "name": "Pyramid of Giza",
            "openingHours": "9:00 AM - 5:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": ""
        },
        {
            "budget": "Mid-range",
            "description": "Point 90 Mall is a popular shopping destination in Maadi. It offers a range of local and international brands, including H&M, Zara, and Adidas. The mall also features a cinema complex and a variety of dining options.",
            "imageURL": "https://ehaf.com/storage/app/projects_gallery/full_size/point-90-mall,-egypt-1.jpg",
            "lat": 30.0444196,
            "lng": 31.2357116,
            "name": "Point 90 Mall",
            "openingHours": "10:00 AM - 12:00 AM",
            "place_id": None,
            "website": ""
        },
        {
            "budget": "Budget-friendly",
            "description": "Khan el-Khalili is one of the oldest and most famous bazaars in the Middle East. It's a great place to find unique souvenirs and local handicrafts. The bazaar is filled with narrow streets and alleys, and visitors can find everything from spices and perfumes to jewelry and textiles.",
            "imageURL": "https://prd-webrepository.firabarcelona.com/wp-content/uploads/sites/69/2023/04/14175713/istock-992735534-scaled.jpg",
            "lat": 30.0477386,
            "lng": 31.2622538,
            "name": "Khan el-Khalili",
            "openingHours": "9:00 AM - 6:00 PM",
            "place_id": None,
            "website": ""
        },
        {
            "budget": "Mid-range",
            "description": "Village Walk Mall is a modern shopping mall located in New Cairo. It features a range of local and international brands, including H&M, Zara, and Apple. The mall also has a variety of dining options and a food court.",
            "imageURL": "https://top10cairo.com/wp-content/uploads/2020/01/mall-of-arabia-best-malls-in-cairo.jpg",
            "lat": 30.0444196,
            "lng": 31.2357116,
            "name": "Village Walk Mall",
            "openingHours": "10:00 AM - 10:00 PM",
            "place_id": None,
            "website": ""
        },
        {
            "budget": "Mid-range",
            "description": "Mall of Arabia is a popular shopping destination in 6th October City. It offers a range of local and international brands, including H&M, Zara, and Adidas. The mall also features a cinema complex and a variety of dining options.",
            "imageURL": "https://www.onartstructures.com/wp-content/uploads/2020/08/IMG_8745-scaled.jpg",
            "lat": 30.0065859,
            "lng": 30.9753955,
            "name": "Mall of Arabia",
            "openingHours": "10:00 AM - 12:00 AM",
            "place_id": None,
            "website": ""
        },
        {
            "budget": "Low",
            "description": "This museum showcases the history and culture of Africa, with a focus on Egyptian artifacts. The vibe is educational and interactive, and visitors can explore exhibits on everything from ancient civilizations to modern-day Africa.",
            "imageURL": "https://rnn.ng/wp-content/uploads/2023/04/Grand-Egyptian-Museum-Egypt-Largest-museums-in-Africa.jpg",
            "lat": 30.0444196,
            "lng": 31.2357116,
            "name": "African Museum",
            "openingHours": "9:00 AM - 5:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": "https://www.manialmuseum.com/"
        },
        {
            "budget": "Low",
            "description": "This entertainment complex offers a range of activities, including an amusement park, cinema, and bowling alley. The vibe is lively and fun, and visitors can enjoy a day out with family and friends.",
            "imageURL": "https://i.pinimg.com/originals/dc/87/e6/dc87e6b875a1f11eeecbfaea2ee8cc68.jpg",
            "lat": 30.0328642,
            "lng": 31.4100122,
            "name": "Cairo Festival City",
            "openingHours": "10:00 AM - 10:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": "https://www.cairofestivalcity.com/"
        },
        {
            "budget": "Low",
            "description": "This bustling market is one of the oldest and most famous in the Middle East, with a wide range of goods on offer, from spices to souvenirs. The vibe is vibrant and chaotic, and visitors can haggle for bargains and try local foods.",
            "imageURL": "https://prd-webrepository.firabarcelona.com/wp-content/uploads/sites/69/2023/04/14175713/istock-992735534-scaled.jpg",
            "lat": 30.0477386,
            "lng": 31.2622538,
            "name": "Khan el-Khalili Market",
            "openingHours": "9:00 AM - 9:00 PM",
            "place_id": None,
            "restrictions": [
                "Kid-friendly"
            ],
            "website": ""
        }
    ]


# clustering test
# print(get_cluster(data, custom_budget_mapping('medium')))



# currated_locations = [{'budget': 'Low', 'description': 'This island in the Nile River is a popular spot for recreation and relaxation, with plenty of green space, walking trails, and picnic areas. The vibe is peaceful and natural, and visitors can take a leisurely stroll or have a picnic with friends.', 'imageURL': 'https://img.freepik.com/free-photo/view-cairo-tower-gezira-island-nile-egypt_400112-711.jpg?w=1800', 'lat': 30.0609422, 'lng': 31.219709, 'name': 'Gezira Island', 'openingHours': '8:00 AM - 8:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': '', 'cluster': 0, 'centroids': 0}, {'budget': 'Mid-range', 'description': 'Heliopolis Mall is a modern shopping mall located in Heliopolis. It features a range of local and international brands, including H&M, Zara, and Apple. The mall also has a variety of dining options and a food court.', 'imageURL': 'https://c8.alamy.com/comp/T8RAP4/atrium-of-city-stars-mall-heliopolis-showing-multi-levels-and-modern-decor-heliopolis-cairo-egypt-T8RAP4.jpg', 'lat': 30.0444196, 'lng': 31.2357116, 'name': 'Heliopolis Mall', 'openingHours': '10:00 AM - 10:00 PM', 'place_id': None, 'restrictions': None, 'website': '', 'cluster': 0, 'centroids': 0}, {'budget': 'Low', 'description': 'This popular park is a great place to relax and enjoy the outdoors, with plenty of green space, walking trails, and picnic areas. The vibe is peaceful and natural, and visitors can take a leisurely stroll or have a picnic with friends.', 'imageURL': 'https://www.barcelo.com/guia-turismo/wp-content/uploads/2022/05/el-cairo-dokki-pal.jpg', 'lat': 30.0382661, 'lng': 31.2114354, 'name': 'Dokki Park', 'openingHours': '8:00 AM - 8:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': '', 'cluster': 0, 'centroids': 0}, {'budget': 'Low', 'description': "For a panoramic view of the city, head to the Cairo Tower. The vibe is modern and exciting, and visitors can enjoy a meal at the tower's restaurant or take a ride to the top for a stunning view.", 'imageURL': 'https://www.egypttoursportal.com/images/2021/04/Cairo-Tower-Egypt-Tours-Portal-1.jpg', 'lat': 30.0459751, 'lng': 31.2242988, 'name': 'Cairo Tower', 'openingHours': '9:00 AM - 10:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': 'https://www.cairo-tower.com/', 'cluster': 0, 'centroids': 1}, {'budget': 'Low', 'description': 'This beautiful mosque is one of the oldest and most important in Cairo, with stunning architecture and intricate tile work. The vibe is peaceful and serene, and visitors can take a guided tour to learn more about its history and significance.', 'imageURL': 'https://www.osiristours.com/wp-content/uploads/2018/11/201803070520052732.jpg', 'lat': 30.0625176, 'lng': 31.2380668, 'name': 'Imam Mosque', 'openingHours': '9:00 AM - 5:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': 'https://www.imammosque.com/', 'cluster': 0, 'centroids': 0}, {'budget': 'Low', 'description': 'This museum showcases the work of Egyptian artists, with a focus on modern and contemporary art. The vibe is creative and inspiring, and visitors can explore exhibits on everything from painting to sculpture.', 'imageURL': 'https://images.squarespace-cdn.com/content/v1/56c13cc00442627a08632989/1585432288121-15NNGMB5XEP5CJ1YSGL3/egyptianmuseum.jpg', 'lat': 30.043688, 'lng': 31.2246792, 'name': 'The Egyptian Museum of Modern Art', 'openingHours': '9:00 AM - 5:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': 'https://www.eegyptianmuseum.com/', 'cluster': 0, 'centroids': 0}, {'budget': 'Mid-range', 'description': 'Point 90 Mall is a popular shopping destination in Maadi. It offers a range of local and international brands, including H&M, Zara, and Adidas. The mall also features a cinema complex and a variety of dining options.', 'imageURL': 'https://ehaf.com/storage/app/projects_gallery/full_size/point-90-mall,-egypt-1.jpg', 'lat': 30.0444196, 'lng': 31.2357116, 'name': 'Point 90 Mall', 'openingHours': '10:00 AM - 12:00 AM', 'place_id': None, 'restrictions': None, 'website': '', 'cluster': 0, 'centroids': 0}, {'budget': 'Mid-range', 'description': 'Village Walk Mall is a modern shopping mall located in New Cairo. It features a range of local and international brands, including H&M, Zara, and Apple. The mall also has a variety of dining options and a food court.', 'imageURL': 'https://top10cairo.com/wp-content/uploads/2020/01/mall-of-arabia-best-malls-in-cairo.jpg', 'lat': 30.0444196, 'lng': 31.2357116, 'name': 'Village Walk Mall', 'openingHours': '10:00 AM - 10:00 PM', 'place_id': None, 'restrictions': None, 'website': '', 'cluster': 0, 'centroids': 0}, {'budget': 'Low', 'description': 'This museum showcases the history and culture of Africa, with a focus on Egyptian artifacts. The vibe is educational and interactive, and visitors can explore exhibits on everything from ancient civilizations to modern-day Africa.', 'imageURL': 'https://rnn.ng/wp-content/uploads/2023/04/Grand-Egyptian-Museum-Egypt-Largest-museums-in-Africa.jpg', 'lat': 30.0444196, 'lng': 31.2357116, 'name': 'African Museum', 'openingHours': '9:00 AM - 5:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': 'https://www.manialmuseum.com/', 'cluster': 0, 'centroids': 0}, {'budget': 'High-end', 'description': 'Cairo Festival City Mall is a luxurious shopping mall located in Nasr City. It features a range of high-end international brands such as Louis Vuitton, Gucci, and Chanel, as well as local Egyptian brands. The mall also has an IMAX theatre and a variety of dining options.', 'imageURL': 'http://gb.gleeds.com/contentassets/72182d734782442b909cbc53d956f99c/cacm0001_n33.jpg', 'lat': 30.02883619999999, 'lng': 31.4075861, 'name': 'Cairo Festival City Mall', 'openingHours': '10:00 AM - 10:00 PM', 'place_id': None, 'restrictions': None, 'website': 'https://www.cairofestivalcitymall.com/', 'cluster': 1, 'centroids': 0}, {'budget': 'Low', 'description': 'This entertainment complex offers a range of activities, including an amusement park, cinema, and bowling alley. The vibe is lively and fun, and visitors can enjoy a day out with family and friends.', 'imageURL': 'https://i.pinimg.com/originals/dc/87/e6/dc87e6b875a1f11eeecbfaea2ee8cc68.jpg', 'lat': 30.0328642, 'lng': 31.4100122, 'name': 'Cairo Festival City', 'openingHours': '10:00 AM - 10:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': 'https://www.cairofestivalcity.com/', 'cluster': 1, 'centroids': 1}, {'budget': 'High-end', 'description': 'The Mall of Egypt is a luxurious shopping mall located in 6th October City. It features a range of high-end international brands such as Louis Vuitton, Gucci, and Chanel, as well as local Egyptian brands. The mall also has an IMAX theatre, a virtual reality experience, and a variety of dining options.', 'imageURL': 'https://www.bimcommunity.com/files/images/experiences/Mall-of-Egypt.jpg', 'lat': 29.97242739999999, 'lng': 31.0164062, 'name': 'The Mall of Egypt', 'openingHours': '10:00 AM - 10:00 PM', 'place_id': None, 'restrictions': None, 'website': 'https://www.mallofegypt.com/', 'cluster': 2, 'centroids': 0}, {'budget': 'Mid-range', 'description': 'Mall of Arabia is a popular shopping destination in 6th October City. It offers a range of local and international brands, including H&M, Zara, and Adidas. The mall also features a cinema complex and a variety of dining options.', 'imageURL': 'https://www.onartstructures.com/wp-content/uploads/2020/08/IMG_8745-scaled.jpg', 'lat': 30.0065859, 'lng': 30.9753955, 'name': 'Mall of Arabia', 'openingHours': '10:00 AM - 12:00 AM', 'place_id': None, 'restrictions': None, 'website': '', 'cluster': 2, 'centroids': 1}, {'budget': 'Low', 'description': 'One of the Seven Wonders of the Ancient World, the Pyramid of Giza is a must-visit attraction in Cairo. The vibe is historic and awe-inspiring, and visitors can take a guided tour to learn more about its construction and significance.', 'imageURL': 'https://i.natgeofe.com/n/535f3cba-f8bb-4df2-b0c5-aaca16e9ff31/giza-plateau-pyramids.jpg?w=1200', 'lat': 29.9791705, 'lng': 31.1342046, 'name': 'Pyramid of Giza', 'openingHours': '9:00 AM - 5:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': '', 'cluster': 3, 'centroids': 1}, {'budget': 'Mid-range', 'description': 'The AUC New Campus Mall is a modern shopping mall located on the campus of the American University in Cairo. It features a range of local and international brands, including H&M, Zara, and Apple. The mall also has a variety of dining options and a food court.', 'imageURL': 'https://auctoday.com/wp-content/uploads/2019/02/20170816-_D8E1343.jpg', 'lat': 30.0192078, 'lng': 31.5004742, 'name': 'AUC New Campus Mall', 'openingHours': '10:00 AM - 10:00 PM', 'place_id': None, 'restrictions': None, 'website': '', 'cluster': 4, 'centroids': 1}, {'budget': 'Budget-friendly', 'description': "Khan el-Khalili is one of the oldest and most famous bazaars in the Middle East. It's a great place to find unique souvenirs and local handicrafts. The bazaar is filled with narrow streets and alleys, and visitors can find everything from spices and perfumes to jewelry and textiles.", 'imageURL': 'https://prd-webrepository.firabarcelona.com/wp-content/uploads/sites/69/2023/04/14175713/istock-992735534-scaled.jpg', 'lat': 30.0477386, 'lng': 31.2622538, 'name': 'Khan el-Khalili', 'openingHours': '9:00 AM - 6:00 PM', 'place_id': None, 'restrictions': None, 'website': '', 'cluster': 5, 'centroids': 1}, {'budget': 'Low', 'description': 'This bustling market is one of the oldest and most famous in the Middle East, with a wide range of goods on offer, from spices to souvenirs. The vibe is vibrant and chaotic, and visitors can haggle for bargains and try local foods.', 'imageURL': 'https://prd-webrepository.firabarcelona.com/wp-content/uploads/sites/69/2023/04/14175713/istock-992735534-scaled.jpg', 'lat': 30.0477386, 'lng': 31.2622538, 'name': 'Khan el-Khalili Market', 'openingHours': '9:00 AM - 9:00 PM', 'place_id': None, 'restrictions': ['Kid-friendly'], 'website': '', 'cluster': 5, 'centroids': 0}, {'budget': 'Mid-range', 'description': 'City Stars Mall is a popular shopping destination in Nasr City. It offers a range of local and international brands, including H&M, Zara, and Adidas. The mall also features a cinema complex, a bowling alley, and a variety of dining options.', 'imageURL': 'https://i.redd.it/vfykp05dedg51.jpg', 'lat': 30.0729538, 'lng': 31.3455066, 'name': 'City Stars Mall', 'openingHours': '10:00 AM - 12:00 AM', 'place_id': None, 'restrictions': None, 'website': 'https://www.citystarsmall.com/', 'cluster': 6, 'centroids': 1}]

# get_results(currated_locations, no_days, start_day_template, end_day_template, travel_stye)
# result, suggestion = get_results(currated_locations, 3, {"morning": [], "afternoon": [], "evening": []}, {}, {"relaxed": 0, "compact": 0})
# print(result)

# print('Suggestions: \n', suggestion)

# grid test
# print(grid_cluster(currated_locations, 3,  2))

# print(get_max_locations({"relaxed": 0, "compact": 0}))