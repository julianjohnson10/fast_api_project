import requests
from io import BytesIO

# Retrieve the image data from the API endpoint
image_url = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203507.png'
image_name = image_url.split('/')[-1]
response = requests.get(image_url)
image_data = response.content

with open(image_name, 'wb') as image:
    image.write(image_data)