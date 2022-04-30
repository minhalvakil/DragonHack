To convert the FIPS csv file to a usable json file
    1. Converted the csv to a pandas DataFrame
    2. Pop uneccessary columns (i.e. STATE_COUNTY)
    3. Create an empty dictionary titled data
    4. Iterate over each row using df.index using a for loop
        i. Within the loop check to see if the current State Abbr (i.e. AL) is a key inside data
        ii. If not create the key by setting equal to a list, with the first value being a dictionary of the current CountyName (key) and CountyFIPS (value)
        iii. If the current StateAbbr is a key in data, append the current CountyName (key) and CountyFIPS (value) as a new dictionary
    5. After the loop has finished open a new json file titled FIPS.json and write to it
    6. Then use json.dump and dump the dictionary onto FIPS.json with an indent value of 4