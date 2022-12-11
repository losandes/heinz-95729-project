## Build tools & versions used

- API 31
- Gradle 7.3.3
- minSDK 23
- targetSDK 32
- Jetpack Compose

## Steps to run the app

Launch Android Chipmunk and run with phone

## What areas of the app did you focus on?

- I focused on a developing for a phone, specifically testing on the Pixel line.
- Building basic UI with jetpack compose 
- Separation of layers
- Data Flow

## What was the reason for your focus? What problems were you trying to solve?

- Keeping strong separation between layers for highly testable code. 
- Keeping code simple and modularized 
- Trying to hit all the points in the project prompt

## What was the reason for your focus? What problems were you trying to solve?

Keeping strong separation between layers for highly testable code. Keeping code simple and
modularized Trying to hit all the points in the project prompt

## How long did you spend on this project?

5-6 hours of actually coding but some more time googling a couple things.

## Did you make any trade-offs for this project? What would you have done differently with more time?

I spent more time on the architecture and ignored code quality in some of the classes. There should
be constants for the Compose Modifier values and others, etc. There was also a few things with
compose I had to work around, given time i'm sure id find the proper solution. But the functionality
is there.

## What do you think is the weakest part of your project?

The UI design,with more time I would have added in more data into the list item and cleaned up the
compose code. Also adding a Toolbar

## Did you copy any code or dependencies? Please make sure to attribute them here!

I copied the TestRule code from other personal code.

- Coil
- Koin
- Retrofit
- Moshi
- RxJava
- Accompanist
- Mockito

## Is there any other information you’d like us to know?

I wouldn't call this production ready just yet since there are tests missing and the ViewModel could
be cleaned up. Focusing on the structure, simplicity and testability was my goal here. There are
also a couple todos i've left in.