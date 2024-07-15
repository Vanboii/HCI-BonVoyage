# converts coutnry name to iso_alpha 2
# taken from: https://www.travel-advisory.info/api
# courtesy of: https://www.travel-advisory.info

countries = {'Andorra': 'AD', 
             'United Arab Emirates': 'AE', 
             'Afghanistan': 'AF', 
             'Antigua and Barbuda': 'AG', 
             'Anguilla': 'AI', 
             'Albania': 'AL', 
             'Armenia': 'AM', 
             'Angola': 'AO', 
             'Argentina': 'AR', 
             'American Samoa': 'AS', 
             'Austria': 'AT', 
             'Australia': 'AU', 
             'Aruba': 'AW', 
             'Azerbaijan': 'AZ', 
             'Bosnia and Herzegovina': 
             'BA', 'Barbados': 'BB', 
             'Bangladesh': 'BD', 
             'Belgium': 'BE', 
             'Burkina Faso': 'BF', 
             'Bulgaria': 'BG', 
             'Bahrain': 'BH', 
             'Burundi': 'BI', 
             'Benin': 'BJ', 
             'Saint BarthÃ©lemy': 'BL', 
             'Bermuda': 'BM', 
             'Brunei': 'BN', 
             'Bolivia': 'BO', 
             'Brazil': 'BR', 
             'Bahamas': 'BS', 
             'Bhutan': 'BT', 
             'Botswana': 'BW', 
             'Belarus': 'BY', 
             'Belize': 'BZ', 
             'Canada': 'CA', 
             'Cocos Islands': 'CC', 
             'Democratic Republic of the Congo': 'CD', 
             'Central African Republic': 'CF', 
             'Republic of the Congo': 'CG', 
             'Switzerland': 'CH', 
             'Ivory Coast': 'CI', 
             'Cook Islands': 'CK', 
             'Chile': 'CL', 
             'Cameroon': 'CM', 
             'China': 'CN', 
             'Colombia': 'CO', 
             'Costa Rica': 'CR', 
             'Cuba': 'CU', 
             'Cape Verde': 'CV', 
             'Christmas Island': 'CX', 
             'Cyprus': 'CY', 
             'Czech Republic': 'CZ', 
             'Germany': 'DE', 
             'Djibouti': 'DJ', 
             'Denmark': 'DK', 
             'Dominica': 'DM', 
             'Dominican Republic': 'DO', 
             'Algeria': 'DZ', 
             'Ecuador': 'EC', 
             'Estonia': 'EE', 
             'Egypt': 'EG', 
             'Western Sahara': 'EH', 
             'Eritrea': 'ER', 
             'Spain': 'ES', 
             'Ethiopia': 'ET', 
             'Finland': 'FI', 
             'Fiji': 'FJ', 
             'Falkland Islands': 'FK', 
             'Micronesia': 'FM', 
             'Faroe Islands': 'FO', 
             'France': 'FR', 
             'Gabon': 'GA', 
             'United Kingdom': 'GB', 
             'Grenada': 'GD', 
             'Georgia': 'GE', 
             'French Guiana': 'GF', 
             'Guernsey': 'GG', 
             'Ghana': 'GH', 
             'Gibraltar': 'GI', 
             'Greenland': 'GL', 
             'Gambia': 'GM', 
             'Guinea': 'GN', 
             'Guadeloupe': 'GP', 
             'Equatorial Guinea': 'GQ', 
             'Greece': 'GR', 
             'South Georgia and the South Sandwich Islands': 'GS', 
             'Guatemala': 'GT', 
             'Guam': 'GU', 
             'Guinea-Bissau': 'GW', 
             'Guyana': 'GY', 
             'Hong Kong': 'HK', 
             'Honduras': 'HN', 
             'Croatia': 'HR', 
             'Haiti': 'HT', 
             'Hungary': 'HU', 
             'Indonesia': 'ID', 
             'Ireland': 'IE', 
             'Israel': 'IL', 
             'Isle of Man': 'IM', 
             'India': 'IN', 
             'Iraq': 'IQ', 
             'Iran': 'IR', 
             'Iceland': 'IS', 
             'Italy': 'IT', 
             'Jersey': 'JE', 
             'Jamaica': 'JM', 
             'Jordan': 'JO', 
             'Japan': 'JP', 
             'Kenya': 'KE', 
             'Kyrgyzstan': 'KG', 
             'Cambodia': 'KH',
             'Kiribati': 'KI', 
             'Comoros': 'KM', 
             'Saint Kitts and Nevis': 'KN', 
             'North Korea': 'KP', 
             'South Korea': 'KR', 
             'Kuwait': 'KW', 
             'Cayman Islands': 'KY', 
             'Kazakhstan': 'KZ', 
             'Laos': 'LA', 
             'Lebanon': 'LB', 
             'Saint Lucia': 'LC', 
             'Liechtenstein': 'LI', 
             'Sri Lanka': 'LK', 
             'Liberia': 'LR', 
             'Lesotho': 'LS', 
             'Lithuania': 'LT', 
             'Luxembourg': 'LU', 
             'Latvia': 'LV', 
             'Libya': 'LY', 
             'Morocco': 'MA', 
             'Monaco': 'MC', 
             'Moldova': 'MD', 
             'Montenegro': 'ME', 
             'Saint Martin': 'MF', 
             'Madagascar': 'MG', 
             'Marshall Islands': 'MH', 
             'Macedonia': 'MK', 
             'Mali': 'ML', 
             'Myanmar': 'MM', 
             'Mongolia': 'MN', 
             'Macao': 'MO', 
             'Northern Mariana Islands': 'MP', 
             'Martinique': 'MQ', 
             'Mauritania': 'MR', 
             'Montserrat': 'MS', 
             'Malta': 'MT', 
             'Mauritius': 'MU', 
             'Maldives': 'MV', 
             'Malawi': 'MW', 
             'Mexico': 'MX', 
             'Malaysia': 'MY', 
             'Mozambique': 'MZ', 
             'Namibia': 'NA', 
             'New Caledonia': 'NC', 
             'Niger': 'NE', 
             'Norfolk Island': 'NF', 
             'Nigeria': 'NG', 
             'Nicaragua': 'NI', 
             'Netherlands': 'NL', 
             'Norway': 'NO', 
             'Nepal': 'NP', 
             'Niue': 'NU', 
             'New Zealand': 'NZ', 
             'Oman': 'OM', 
             'Panama': 'PA', 
             'Peru': 'PE', 
             'French Polynesia': 'PF', 
             'Papua New Guinea': 'PG', 
             'Philippines': 'PH', 
             'Pakistan': 'PK', 
             'Poland': 'PL', 
             'Saint Pierre and Miquelon': 'PM', 
             'Pitcairn': 'PN', 
             'Puerto Rico': 'PR', 
             'Palestinian Territory': 'PS', 
             'Portugal': 'PT', 
             'Palau': 'PW', 
             'Paraguay': 'PY', 
             'Qatar': 'QA', 
             'Reunion': 'RE', 
             'Romania': 'RO', 
             'Serbia': 'RS', 
             'Russia': 'RU', 
             'Rwanda': 'RW', 
             'Saudi Arabia': 'SA', 
             'Solomon Islands': 'SB', 
             'Seychelles': 'SC', 
             'Sudan': 'SD', 
             'Sweden': 'SE', 
             'Singapore': 'SG', 
             'Saint Helena': 'SH', 
             'Slovenia': 'SI', 
             'Svalbard and Jan Mayen': 'SJ', 
             'Slovakia': 'SK', 
             'Sierra Leone': 'SL', 
             'San Marino': 'SM', 
             'Senegal': 'SN', 
             'Somalia': 'SO', 
             'Suriname': 'SR', 
             'South Sudan': 'SS', 
             'Sao Tome and Principe': 'ST', 
             'El Salvador': 'SV', 
             'Syria': 'SY', 
             'Swaziland': 'SZ', 
             'Turks and Caicos Islands': 'TC', 
             'Chad': 'TD', 
             'Togo': 'TG', 
             'Thailand': 'TH', 
             'Tajikistan': 'TJ', 
             'East Timor': 'TL', 
             'Turkmenistan': 'TM', 
             'Tunisia': 'TN', 
             'Tonga': 'TO', 
             'Turkey': 'TR', 
             'Trinidad and Tobago': 'TT', 
             'Tuvalu': 'TV', 
             'Taiwan': 'TW', 
             'Tanzania': 'TZ', 
             'Ukraine': 'UA', 
             'Uganda': 'UG', 
             'United States': 'US', 
             'Uruguay': 'UY', 
             'Uzbekistan': 'UZ', 
             'Vatican': 'VA', 
             'Saint Vincent and the Grenadines': 'VC', 
             'Venezuela': 'VE', 
             'British Virgin Islands': 'VG', 
             'U.S. Virgin Islands': 'VI', 
             'Vietnam': 'VN', 
             'Vanuatu': 'VU', 
             'Wallis and Futuna': 'WF', 
             'Samoa': 'WS', 
             'Kosovo': 'XK', 
             'Yemen': 'YE', 
             'Mayotte': 'YT', 
             'South Africa': 'ZA', 
             'Zambia': 'ZM', 
             'Zimbabwe': 'ZW'}

def convert_to_countrycode(country_name: str):
    return countries[country_name]