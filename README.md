# Scope, User Stories and Design 

## Scope statement 
Develop a Google Assistant Actions for Google Home Devices which integrates with Google DialogFlow. Using the dummy dataset to simulate a shopping experience. 
### Objectives 
At the end of this project, users will be able to 
1. Log in with a google account (Oauth)
2. Browsing shopping choices 
* Users need to mention the exact item name in order to reach the correct items, no recommending list provided *
3. Select a certain item and add to shopping cart 
4. Delete certain items from shopping cart 
5. Browse everything in the shopping cart 
6. Check out 
* Get the total price and clear everything in the shopping cart after the checkout action 

## User Story 
<br>
<table>
    <tr>
        <th>USer Story</th>
        <th>Story Points</th>
    </tr>
    <tr>
        <td>As a customer, I want to log in my google account, so that I can start to shop and get related shopping records which store in my account</td>
        <td>8</td>
    </tr>        
    <tr>
        <td>As a customer, I want to browsing choices, so that I can check the price of different type of items</td>
        <td>5</td>
    </tr> 
    <tr>
        <td>As a customer, I want to select a certain item and add to shopping cart</td> 
        <td>5</td>
    </tr> 
    <tr>
        <td>As a customer, I want to delete items from shopping cart 3 As a customer, I want to Browse everything in the shopping cart</td>
        <td>2</td>
    </tr>  
    <tr>
        <td>As a customer, I want to Check out, so that I can buy them 
        </td> 
        <td>1</td>
    </tr>
    <tr>
        <td>As a customer, I want to Check out, so that I can see the total price
        </td> 
        <td>5</td>
    </tr>  
</table>

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

### Running Examples
### Dependencies
Have NodeJS installed
Have MongoDB installed and running
### List of Available Products
- banana
- apple
- coffee
- chocolate
- orange
- milk
- pomegranate
- kivi
- pear
- berry
### Logic Flow
