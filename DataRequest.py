
import requests
import json

class DataRequest:
    key = "681ebd5f00a64477869a9c03c033c4bc"
    def __init__(self, fips:int):
        self.FIPS = fips
        self.apiLink = "https://api.covidactnow.org/v2/county/{0}.json?apiKey={1}".format(fips, self.key)
    def request(self):
        response_API = requests.get(self.apiLink)
        data = response_API.text
        dataJson = json.loads(data)
        with open('data.txt', 'w') as f:
            json.dump(dataJson, f, ensure_ascii=False)
if __name__ == '__main__':
    ##$request = DataRequest(36091)
    ##print(request.request())
    pass