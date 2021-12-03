import slack
import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, Response
from slackeventsapi import SlackEventAdapter
import psycopg2

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
slack_event_adapter = SlackEventAdapter(os.environ['SIGNING_SECRET'] ,'/slack/events', app)
conn = psycopg2.connect(dbname="testdb", user="johnkim", port="5433")
cur = conn.cursor()


client = slack.WebClient(token=os.environ['SLACK_TOKEN'])

#AN EXAMPLE CODE TO POST MESSAGES THROUGH SLACK BOT
client.chat_postMessage(channel = '#slack-cui', text = "Hello World!")

#AN EXAMPLE CODE TO HANDLE END POINTS FOR SLASH COMMANDS THROUGH SLACK BOT
@app.route('/start', methods=['POST'])
def start_bot():
    data = request.form
    user_id = data.get('user_id')
    channel_id = data.get('channel_id')
    client.chat_postEphemeral(channel=channel_id, text=f"Hello!", user=user_id)
    #client.chat_postMessage(channel=channel_id, text=f"Hello {user_id}!")
    return Response(), 200


@app.route('/add' , methods=['POST'])
def add():
    command_text = request.data.get('text')
    command_text = command_text.split(' ')

    # if user does not specify item or quantity to add
    if len(command_text) == 1:
      # mentions the quantity first
      if isinstance(command_text[0], int):
          response_body = {'text': 'Please specify the items you want to add'}

      # mentions the item first
      elif isinstance(command_text[0], str):
          response_body = {'text': 'Please specify the amount you want to add'}

    # if user specifies both items and quantity to add
    elif len(command_text) > 1:
        arr = categorize(command_text)
        item, quantity = arr[0], arr[1]

    response = jsonify(response_body)
    response.status_code = 200
    return response


def categorize(text_arr):
    quantity = 0
    item = ""
    for specific in text_arr:
        if isinstance(specific, int):
            quantity = specific
        else:
            item += specific
    return [item, quantity]

# Execute a query
# cur.execute("SELECT * FROM my_data")

# Retrieve query results
# records = cur.fetchall()


if __name__ == "__main__":
    app.run(debug=True)