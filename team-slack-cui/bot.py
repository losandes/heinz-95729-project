import slack
import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, Response
from slackeventsapi import SlackEventAdapter

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
slack_event_adapter = SlackEventAdapter(os.environ['SIGNING_SECRET'] ,'/slack/events', app)

client = slack.WebClient(token=os.environ['SLACK_TOKEN'])

#AN EXAMPLE CODE TO POST MESSAGES THROUGH SLACK BOT
client.chat_postMessage(channel = '#slack-cui', text = "Hello World!")

#AN EXAMPLE CODE TO HANDLE END POINTS FOR SLASH COMMANDS THROUGH SLACK BOT
@app.route('/start', methods=['POST'])
def start_bot():
    data = request.form
    user_id = data.get('user_name')
    channel_id = data.get('channel_id')
    client.chat_postMessage(channel=channel_id, text=f"Hello {user_id}!")
    return Response(), 200

if __name__ == "__main__":
    app.run(debug=True)