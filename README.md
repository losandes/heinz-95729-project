# CMU Heinz 95729 Course Project (2019)
## Contibutors : [Keshav Pandey](https://github.com/Keshav-Pandey/) Monika Jengaria


## Introduction

Our project is focused on utilizing ML algorithms to create value for users.

## Git Branching strategy

We are using [feature branching](https://docs.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops) for out git strategy.


Navigate to http://localhost:3000 to see the documentation

## Starting the Web app

After cloning the repository open the CognitoBot.sln file with visual studio to get started. Run the project and you should be good to go. PS: The slack OAuth keys are shared seperately.

## Aylien Sentiment API

We are using a free tier for the Aylien Sentiment API. In case the API doesn't run using our key and if you want to use your own key you can goto https://aylien.com/ and signup to get your own free key. It should be issued immidiately after signup and can be accessed in the [Dashboard](https://developer.aylien.com/admin/)
You can put the required auth fields in [AylienSentimentFetch](https://github.com/Keshav-Pandey/heinz-95729-project/blob/master/CognitoBot/AylienSentimentFetch.cs)

## CognitoTestProject

This project contains the unit tests for our codebase.