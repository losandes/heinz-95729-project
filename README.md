# Scope   and   User   Stories 

## Scope statement 
<br>Develop a Google Assistant Actions for Google Home Devices which integrates with Google DialogFlow. Using the dataset provided in course to simulate a shopping experience. Objectives At the end of this project, users will be able to 
1. Log in with a google account (Oauth)
2. Browsing shopping choices 
<br>Users need to mention the exact item name in order to reach the correct items, no recommending list provided 
3. Select certain item and add to shopping cart 
4. Delete certain items from shopping cart ●Browse everything in the shopping cart ●Check out ○Clear everything in the shopping cart after the checkout action 

## User Story 
<br>
| USer Story                             | Story Points  |
| --------------:-----------------------:| -------------:|
| As a customer, I want to log in my google account, so that I can start to shop and related shopping records can store in my account |  8            :|
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
User   Stories   8 As a customer, I want to Browsing choices, so that I can check the price of different type of items 5 As a customer, I want to Select certain item and add to shopping cart 5 As a customer, I want to Delete items from shopping cart 3 As a customer, I want to Browse everything in the shopping cart 2 As a customer, I want to Check out, so that I can buy them 1 As a customer, I want to see what I bought previously 2 As a customer, I want to Check out with stripe, so that it is much easier 8 

## Deliverables and Design
 - whether we could implement Oauth or just simply use one user 
 - Browse and prepare shopping item dataset ●Set up database with MongoDB
 - Store shopping history into database ●Create endpoints via node.js  
 1. GET itemDetail 
 2. POST addToShoppingCart 
 3. DELETE fromShoppingCart 
 4. GET allShoppingCart 
 5. DELETE/ POST/ PUT checkout shoppingCart) 
 - DialogFlow: Users complete the shopping process through interacting with chatbot 
<br>
