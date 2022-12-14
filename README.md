# ScottyBot Dialogflow

## Meet ScottyBot

Please go to the scottybot-development-workspace channel that you were invited to and begin interacting with @ScottyBot_Mayank.
We have deployed the application contained in this Dialogflow portion of the project to heroku for you to access it more easily.
If there are any questions, concerns or issues please reach out to us.
If you would like to use a local environment for the application, database or both please see the following instructions.

## Manual Setup

First make sure that a recent version of python is installed on your computer.
Once python is installed, enter the main project directory and open a terminal (bash terminal for Mac, git bash for windows).
Create a virtual environment:
```Shell
$ pip install virtualenv
$ python -m virtualenv venv
```

> Note: if python -m virtualenv venv does not work, try python3 -m virtualenv venv

next activate the virtual environment 
for Windows CMD Terminal:
```Shell
C:\> venv\Scripts\activate
```
for Mac:
```Shell
$ source venv/bin/activate
```
Now that the virtual environment is activated (you should see somthing along the lines of (venv) above or preceding your command input line. Now we will install the required packages for this project.
```Shell
(venv) $ pip install -r requirements.txt
```

> Note: if you plan on pushing this to github, ensure that your .gitignore file includes venv

## Setting up Environment Variables 

Next we want to ensure our environment variables are set up so that our project runs smoothly. To do this, create a .env file and create a variable OPENAI_API_KEY with the provided GPT3 api secret key (or your own if that is preferred) as well as a variable DB_PASSWORD with the provided password to access our Azure MySQL database. 
For a Windows set up, you will make a call in your cmd terminal.
```Shell
set DB_Password=<password_here>
set OPENAI_API_KEY=<GPT3_API_SECRET_KEY_HERE>
```

> Note: If you prefer to use your own database, please use the provided Generate ScottyBot Database script to populate a relational database named scottybot. If you choose to use your own database (this can be a local database) then you will need to change the host, user and password in the database_functions.py module as well as update or delete the ssl_ca and port sections of the connection  

Once you have your .env file, in your terminal run the command 
for Mac:
```Shell
$ source .env 
```

> Note: if you plan on pushing this to github, ensure that your .gitignore file includes .env

## Running and Interacting with ScottyBot

Now that the virtual environment is set up, we will need to create a url will be the endpoint that Dialogflow communicates with. Flask is operating on port 5000 so we will use ngrok to tunnel our port 5000 to an https url that we can use with dialogflow. 
If you do not have ngrok please download and set that up now (it is free!).
Once you have ngrok set up, open a separate terminal and use the command:
```Shell
ngrok http 5000
```
to start the tunnel. There will be two forwarding urls, copy the one that begins with https.
Now that you have that url, go to the scottyBot Dialogflow ES project and click on fulfillment. In the URL* entry field, delete everything prior to '/webhook' and replace it with the https url that is running through ngrok and then click 'Save' at the bottom of the page.
Now that dialogflow knows what URL to communicate with, return to the terminal in the scottybot project directory and run the following command:
```Shell
python app.py
```
> Note: if that does not work try python3 app.py  

Now that the app is running and there is a URL that Dialogflow can communicate with, please go to the scottybot-development-workspace channel that you were invited to you and communicate with @ScottyBot_Mayank 

## Final Steps

Once you are done communicating with ScottyBot, make sure to stop the application with the red square or ctrl+c as well as stop the ngrok tunnel with ctrl+c in your terminal. Now that everything is stopped, type the command <strong>deactivate</strong> in the terminal that is open from the project directory to stop the virtual environment.

Please feel free to reach out if you have any questions or concerns. Thank you and we hope you enjoyed ScottyBot!