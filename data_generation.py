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
global prod_count
prod_count=0


def populate_data():
  global prod_count
  i=0
  detailed_descs = []
  print("Product count is: "+str(prod_count))
  for desc in data['Description'][prod_count:50]:
      
      response = openai.Image.create(
        prompt=desc,
        n=3,
        size="512x512"
      )
      img_count=0
      os.makedirs("images_generated/"+str(prod_count))
      for x in response['data']:
        response2 = requests.get(x['url'])
        img = Image.open(BytesIO(response2.content))
        img.save("images_generated/"+str(prod_count)+"/"+str(img_count)+".jpg")
        img_count+=1
      img_count=0

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

      with open('openai_desc4.txt', 'a') as f:
        f.write(current_desc)
        f.write("\n###\n")
      prod_count+=1
      if(prod_count in [4,62,79]):
        print("SKIPPING "+str(prod_count))
        with open('openai_desc4.txt', 'a') as f:
          f.write("EMPTY")
          f.write("\n###\n")
        prod_count+=1
      print(prod_count)
      if(prod_count%5==0):
        return
      
      

print("HEYY")
schedule.every(3).minutes.do(populate_data)

while True:
    schedule.run_pending()
    time.sleep(1)