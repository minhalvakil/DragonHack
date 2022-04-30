

if __name__ == '__main__':
    import pandas as pd
    import json

    FIPS = pd.read_csv('Fauci Says/FIPS.csv', delimiter = '\t')
    df = pd.DataFrame(data = FIPS)
    df.reset_index(drop=True, inplace=False)
    df.pop('StateFIPS')
    df.pop('CountyFIPS_3')
    df.pop('StateName')
    df.pop('STATE_COUNTY')
    df.to_csv('Trial.csv', index = False)
    
    Trial = pd.read_csv('Fauci Says/Trial.csv', delimiter = ',')
    df1 = pd.DataFrame(data = Trial)
    df1.reset_index(drop=True, inplace=False)
    print(df1)
    
    data = {}
    for i in df1.index:
        if df1['StateAbbr'][i] in data.keys():
            data[df1['StateAbbr'][i]].append({df1['CountyName'][i] : str(df1['CountyFIPS'][i])})
        else:
            data[df1['StateAbbr'][i]] = [{df1['CountyName'][i] : str(df1['CountyFIPS'][i])}]
    print(data)

    with open("FIPS.json", "w") as write_file:
        json.dump(data, write_file, indent = 4)