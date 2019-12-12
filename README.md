# CMU Heinz 95729 Course Project (2019)
## Contibutors : [Keshav Pandey](https://github.com/Keshav-Pandey/) Monika Jengaria


## Introduction

Our project is focused on utilizing ML algorithms to create value for users.

## Git Branching strategy

We are using [feature branching](https://docs.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops) for out git strategy.

We have a Azure pipeline which runs a Build and Test check pipeline for every pull request raised to make sure that the new changes doesn't break the system.
[Azure Build and Test Pipeline](https://keshavpandey.visualstudio.com/CognitoBot/_build)

## Boards

We are using Boards in Azure DevOps to track our user stories and progress.
This can be accessed here: https://keshavpandey.visualstudio.com/CognitoBot/_boards/board/t/CognitoBot%20Team/Stories
I have provided access to relevant stakeholders.


## Starting the Web app

After cloning the repository open the CognitoBot.sln file with visual studio to get started. Run the project and you should be good to go. PS: The slack OAuth keys are shared seperately.

## Aylien Sentiment API

We are using a free tier for the Aylien Sentiment API. In case the API doesn't run using our key and if you want to use your own key you can goto https://aylien.com/ and signup to get your own free key. It should be issued immidiately after signup and can be accessed in the [Dashboard](https://developer.aylien.com/admin/)
You can put the required auth fields in [AylienSentimentFetch](https://github.com/Keshav-Pandey/heinz-95729-project/blob/master/CognitoBot/AylienSentimentFetch.cs)

## Slack API

We are using Slack's API with O-auth keys. To keep it a secret and prevent misuse we have masked the key. To use the slack API you will need to change the key in [Slack service](https://github.com/Keshav-Pandey/heinz-95729-project/blob/master/CognitoBot/SlackService.cs#L21)

## CognitoTestProject

This project contains the unit tests for our codebase.

## Hosting

We have utilized Azure App services to host our web service.
The endpoint is: https://nlsql.azurewebsites.net/api/cognito

GET : Returns a health check of hello world.
It also has request and reponse from slack for debugging purposes.

POST : This is the endpoint which is hit by slack and we process and return the response status.

PS: If you run the project locally you can use localhost:port/api/coginito to test the application.