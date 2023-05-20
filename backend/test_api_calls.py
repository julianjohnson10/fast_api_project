import requests

with requests.get(url='http://localhost:8000/items') as response:
    print(response.text)