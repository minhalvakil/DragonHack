

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
    
    data = {}
    for i in df.index:
        if df['StateAbbr'][i] in data.keys():
            data[df['StateAbbr'][i]].append({df['CountyName'][i] : str(df['CountyFIPS'][i])})
        else:
            data[df['StateAbbr'][i]] = [{df['CountyName'][i] : str(df['CountyFIPS'][i])}]

    with open("FIPS.json", "w") as write_file:
        json.dump(data, write_file, indent = 4)