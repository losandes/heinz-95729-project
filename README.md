# ScottyBot Dialogflow

## Getting Started

First make sure that a recent version of python is installed on your computer.
Once python is installed, enter the main project directory and open a terminal (bash terminal for Mac, git bash for windows).
Create a virtual environment:
```Shell
$ pip install virtualenv
$ python -m virtualenv venv
```

> Note: if python -m virtualenv venv does not work, try python3 -m virtualenv venv

next activate the virtual environment 
for Windows Git Bash:
```Shell
$ source venv/Scripts/activate
```
for Mac:
```Shell
$ source venv/bin/activate
```
Now that the virtual environment is activated (you should see somthing along the lines of venv in parentesis above or preceding your command input line) we will install the required packages for this project.
```Shell
(venv) $ pip install -r requirements.txt
```

> Note: if you plan on pushing this to github, ensure that your .gitignore file includes venv

## Setting up Environment Variables 

Next we want to ensure our environment variables are set up so that our project runs smoothly. To do this, create a .env file and create a variable OPENAI_API_KEY with the provided GPT3 api secret key (or your own if that is preferred) as well as a variable DB_PASSWORD with the provided password to access our Azure MySQL database. 

> Note: If you prefer to use your own database, please use the provided Generate ScottyBot Database script to populate a relational database named scottybot. If you choose to use your own database (this can be a local database) then you will need to change the host, user and password in the database_functions.py module as well as update or delete the ssl_ca and port sections of the connection

Once you have your .env file, in your terminal run the command 
```Shell
$ source .env 
```

> Note: if you plan on pushing this to github, ensure that your .gitignore file includes venv

## Running and Interacting with ScottyBot

