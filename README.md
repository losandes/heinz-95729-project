# Welcome to Starbux!
Star bux is a conversational user interface (CUI) that helps the user order coffee, our application is deployed on AWS, and makes use of dialogflow's NLP SaaS as well as Google Assistant's User Interface. The user can add item to the cart, view current cart, check out, set personalizations, and more. 

------------------------------
# The App

### How to see Starbux in Action
iPhone: 
1. First go to the App Store and download the Google Assistant App
1.2 Open the Google Assistant App and sign in with your email (in your case: andes.collab@gmail.com)
2. Hit the explore icon at the bottom right of the Google Assistant App
3. Search for Star bux app, andes.collab@gmail.com is already added as an Alpha Tester. Click on the hamburger button to the right of Star bux
4. When in Star bux's main page, click on 'Try It'
5. You should now be able to interact with the CUI
![alt text](https://ecomm-starbux-artifact-bucket.s3.amazonaws.com/instructions.png)

##### Phrases to get started 
- "Talk to Star bux"
- "Personalize"
- "Add Caramel Machiatto"
- "Cart"

### Features
- Personalization of favorite coffee and location for user profile
- Order from menu and related interactions
- Pick a location for the order
- Pickup invalid input with helpful suggestions


#### Sample Interaction Script

|Feature|Sample Interaction|
|---|---|
|*0. Initiate the Converstaion*|- User: "Talk to Starbux"|
|*1. Personalization*|- User: "Personalize"|
|*2. Order*|  - User: "Place an order"<br />User: "Hear menu"<br />User: "Add black coffee"<br />User: "Add Cinnamon Latte"<br />User: "Cart"<br />User: "Clear cart" or "Check Out" |
|*3. Pick Location*|Location is picked out in Personalization so User: "Personalize"|
|*4. Place the Order*|User: "Add Cinnamon Latte"<br />User: "Check Out"|
|*5. Invalid Input*|User: "Add Heinous Crime"<br />"Add Xiangling Liu"|
|*6. Exit*| User: "Cancel"|

#### Limitations
##### User id is fixed to 1
While on a production application, user id should be based on actual user data, implementing authentication and authorization far exceeds the scope of this project, and it provides little add-on value for experiencing with CUI but would be extremely time consuming. Therefore, all user is fixed to user_id of 1, which means there is only "1 user" for the entire application.

-----------------------------

# Setting Up Locally

#### Deployment Requirements:
1. install node.js v16.10.0
2. try to use git bash instead of powershell or command prompt
3. install aws cli: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
4. run `npm install -g prettier`
5. run `npm ci`
6. set up aws configs - ask Ahmad for credentials - asaadat@andrew.cmu.edu

### Project Set Up Directions:
1. run terraform first to set up cloud assets 'terraform plan' and 'terraform apply'
2. scripts/deploy.sh zips the workspace and deploys it to S3, it then updates the lambda to point to the new build
3. our webhook url is a POST: https://u9ofbpxmqd.execute-api.us-east-1.amazonaws.com/Prod/resource

---------------------------

# User Story

User story: Alex is a graduate student at CMU who makes his daily trek to campus by car. Every Tuesday and Thursday he has a morning class starting at 8:35. Before getting to the classroom, he always makes an extra stop at Starbucks to get some coffee as a refresher. But the long line at store always leads to his late arrival for the class. It would be better if someone could order for him on his way so that he could directly go pick up and arrive in the classroom on time. 

*Feature 1: Order the favorite drink for the default location*

*Scenario:* Alex orders his usual favorite
Given that he has already personalized and set up his profile, the App knows that caramel macchiato is Alex’s favorite drink And the default pick-up location is the Starbucks at Forbes Avenue.
Therefore, when he says: “order my favorite drink”, 
the assistant will confirm with: “Okay I have added your favorite Macchiato to your cart, you can either add another drink or when you're ready you can say checkout.”
Then Alex will respond with: “Checkout”
Then the assistant will ask: “Your cart includes 1 Macchiato, would you like to checkout? You can always say clear cart to clear your cart”
Then Alex will respond with: “Yes”
Then the assistant will confirm with:  “Your order will be available for pickup in 10 minutes at forbes ave”

*Feature 2: Order a new drink for a default location*

*Scenario*: Alex orders a new drink from his favorite location
Given Alex wants to try a new drink: Black Coffee
And the default pick-up location is the Starbucks at Forbes Avenue
When he talks to the Google assistant he says: “order a Black Coffee”
Then the assistant will confirm: “Okay I have added Black Coffee to your cart, you can either add another drink or when you're ready you can say checkout.”
Then Alex will respond with: “Check out”
Then the assistant will ask: “Your cart includes 1 Black Coffee, would you like to checkout? You can always say clear cart to clear your cart”
Then Alex will respond: “Yes.”
Then the assistant will confirm “Your order will be available for pickup in 10 minutes at forbes ave”

--------------------------------------------
# Design

#### Data design
Starbux utilizes MongoDB to store user profile and cart items.

User’s profile will be stored in the collection named “profile” which includes user’s favorite drink and favorite location to pick up. It allows user to create a profile or update the profile by calling the function “readProfileItem()” or “updateProfileItems()”.

User’s order will be stored in the collection named “order” which includes userid, item, and item number. When the user adds item to the cart, the input will be stored in this collection and if there are duplicated items, they will be aggregated.

#### Design Pattern:

“Everything should be made as simple as possible, but not any simpler” 

We chose to pursue a modular design pattern because of it’s simplicity and the ease of sharing work. What do we mean? Modular design pattern means that apart from the controllers, every assigned ticket or feature will not cross over with any other feature. For example, the ‘help’ intent module will never cross over with the ‘add item’ intent.

#### Implementation:

Controller/ Event Handler: Index.js
Data Access: DatabaseExecutor.js
Model: other modules
 
#### Architecture:

Actions on Googe is our speech to text platform
Dialogflow is our NLP platform. 
Lambda is our backend service
MongoDB provides database, and state functionality

Starbux is a google assistant application which comes to integrate with Dialogflow and AWS Lambda to create a rich and dynamic user experience. 

To make it simpler, please look at the figure below:
![alt text](https://ecomm-starbux-artifact-bucket.s3.amazonaws.com/Screen+Shot+2022-12-16+at+9.44.20+PM.png)

As you can see, API gateway provides a rest interface to the google assistant and Dialogflow platforms. On the other end, Lambda uses the MongoDB drivers to deliver stateful functionality for the end user.
