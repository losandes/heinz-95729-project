import openai
import requests
import pandas as pd
import numpy as np
import os
import time
import matplotlib.pyplot as plt
from PIL import Image
import schedule
from io import BytesIO
from dotenv import load_dotenv   #for python-dotenv method
load_dotenv()      

openai.api_key = os.getenv("API_KEY")

data = pd.read_csv("data.csv", encoding= 'unicode_escape')
global img_count
img_count=6


def populate_data():
  global img_count
  urls = []
  i=0
  detailed_descs = []
  for desc in data['Description'][img_count:500]:
      response = openai.Image.create(
        prompt=desc,
        n=3,
        size="512x512"
      )
      current_urls = [x['url'] for x in response['data']]
      urls.append(current_urls)
      
      with open('openai_imgs.txt', 'a') as f:
        for img in current_urls:
          f.write("%s\n" % img)
        f.write("\n")

      text_resp = openai.Completion.create(
        model="text-davinci-001",
        prompt=desc,
        temperature=0.4,
        max_tokens=64,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
      )
      current_desc = text_resp['choices'][0]['text']
      detailed_descs.append(current_desc)

      with open('openai_desc.txt', 'a') as f:
        f.write("%s\n" % current_desc)
      i+=len(current_urls)
      if(i>=17):
        return 
      img_count+=len(current_urls)
      print(img_count)

print("HEYY")
schedule.every(3).minutes.do(populate_data)

while True:
    schedule.run_pending()
    time.sleep(1)