module.exports = function Market(Adventure,apiai,sprintf,fs){
const contents = fs.readFileSync("grocery.json")
const jsonContent = JSON.parse(contents)

//define variables
const dialog = new Adventure()
const AIBot=apiai("5c36a3020eeb4f1aa66aefef9ba2027b")
const cartProduct=[]
const cartProductNum=[]
const cartProductUnit=[]
const cartProductPrice=[]
var totalCost=0.0


/*greetings and instructions*/
const greetings = () => {
	return dialog.question({
	    question: 'May I ask are you a new customer here?',
		defaultValue: 'yes'
	}).then((answer) => {
		return new Promise(function (resolve, reject) {
				let request = AIBot.textRequest(answer, {
					sessionId: 'grocerypurchase-206e2'
				})
					 
				request.on('response', function(response) {
					//console.log(response)
					let intent=response.result.metadata.intentName
					//check if the intent of customer is to get instructions
					if(intent=='Get Instructions'){
						console.log('Welcome to our market ! We hope you enjoy your purchase today!')
						console.log('Here are some instructions we prepared for you:')							
						//get instructions
						instructions()
						console.log('')
					}
					else{
						console.log('Welcome back !')
						console.log('You can continue with your shopping now !')
						console.log('')
					}
					resolve()
					//start shopping
					
				})
						 
				request.on('error', function(error) {
					console.log(error)
					reject()
				})
					
				request.end()
				})
			})
}

/*print all instructions to console */
const instructions = () => {
	//print instructions
	console.log('From here, you could:')
	console.log('')
	console.log('1.Add grocercy product to the cart')
	console.log('You could simply use natural language to add products with the number you want.')
	console.log('Remember to include the amount and unit for products.')
	console.log('For example: you could say \'Add three bananas to the cart\'')
	console.log('Or you could say \'Can I have 1 ounce of shampoo\'')
	console.log('')
	console.log('2.View the products in certain apartment')
	console.log('You could view products list in a department by natural language')
	console.log('For example: you could say \'I want some breakfast\'')
	console.log('')
	console.log('3.View the products in your cart')
	console.log('you could view the products in your cart by including \'view cart\' in your request')
	console.log('')
	console.log('4.Check out')
	console.log('you could check out by including \'check out\' in your request')
	console.log('')
	console.log('5.Ask for instructions')
	console.log('Any time you feel comfused. You could simply type \'help\'. or \'instructions\'')
	console.log('')
}

/*ask for customers intention*/
const askForIntention = () => {
  return dialog.question('What would you like to do next?')
}

/*handle customer intents*/
const customerIntents=(answer)=>{
	return new Promise(function (resolve, reject) {
			let request = AIBot.textRequest(answer, {
				sessionId: 'grocerypurchase-206e2'
			})
					 
			request.on('response', function(response) {
				//console.log(response)
				let intent=response.result.metadata.intentName				
				//check intent
				switch (intent) {
					case 'Discover Apartments':
						let department=response.result.parameters.Department;
						//print products in the department
						console.log('Here are what we find at the '+department+' department:')
						let productJson=jsonContent["entities"]
						console.log(sprintf("%-20s%-10s%-10s", 'Product','Unit','UnitPrice'))						
						for(let i=0;i<productJson.length;i++){
							if(productJson[i]["department"]==department){
								console.log(sprintf("%-20s%-10s%-10f",productJson[i]["value"],productJson[i]["unit"],productJson[i]["price"]))
							}
						}
						console.log('')
						return askForIntention().then(customerIntents)
					case 'Add Product':						
						//store products into the cart
						let product=response.result.parameters.Product
						let productNum=parseInt(response.result.parameters.number)
						let productUnit=''
						let productPrice=0.0
						//check if all value are get
						if((typeof product==='string')&&(productNum>0)){
							console.log(response.result.fulfillment.speech)
							console.log('')
						}
						else{
							console.log('Sorry. We can\'t identify what you want')
							return dialog.question('Could you please re-enter what you want to add to cart')
								.then(customerIntents)
						}
						//add product to the cart
						if(cartProduct.indexOf(product)<0){
							let productJson=jsonContent["entities"]
							for(let i=0;i<productJson.length;i++){
								if(productJson[i]["value"]==product){
									//get product price and unit from the stored json data
									productPrice=productJson[i]["price"]
									productUnit=productJson[i]["unit"]
									cartProductUnit.push(productUnit)
									cartProductPrice.push(productPrice)
									//console.log(productPrice+productUnit)
								}
							}
							//console.log(jsonContent["entities"][0])
							cartProduct.push(product)
							cartProductNum.push(productNum)
						}
						else{
							//add up product number
							cartProductNum[cartProduct.indexOf(product)]+=productNum
						}
						//console.log(product+productNum)
						//ask for check out or continue shopping
						return dialog.question({
									question: 'Would you like to view your cart?',
									defaultValue: 'no'
								}).then(viewCart)
						
					case 'Get Instructions':
						//print instructions now
						instructions()
						return askForIntention().then(customerIntents)
					case 'Check Out':
						return viewCart('yes')
					case 'View cart':
						return viewCart('yes')
					default:
						return dialog.question(`I don't understand '`+answer+`'. Please re-enter what would you like to do next`)
									.then(customerIntents)
				resolve()
				
				}
				
				
			})
						 
			request.on('error', function(error) {
				console.log(error)
				reject()
			})
					
			request.end()
		})
}

/*view shopping cart*/
const viewCart=(answer)=>{
	if(answer=='yes'){
		//print cart to the console
		console.log('Here are the products in your cart:')
		console.log(sprintf("%-20s%-10s%-10s%-10s", 'Product','Unit','UnitPrice','Number'))
		for(let i=0;i<cartProduct.length;i++){
			console.log(sprintf("%-20s%-10s%-10f%-10s",cartProduct[i],cartProductUnit[i],cartProductPrice[i],cartProductNum[i]))
		}
		console.log('')
		return dialog.question({
			question: 'Would you like to check out?',
			defaultValue: 'yes'
		}).then(checkout)
	}
	else{
		console.log('It seems you want to continue shopping')
		console.log('')
		//continue shopping
		return askForIntention().then(customerIntents)
	}
}

/*check out*/
const checkout=(answer)=>{
	if(answer=='yes'){
		console.log('Here is your receipt:')
		console.log(sprintf("%-20s%-10s%-10s%-10s%-10s", 'Product','Unit','UnitPrice','Number','SubTotal'))
		for(let i=0;i<cartProduct.length;i++){
			let subTotal=cartProductPrice[i]*cartProductNum[i]
			console.log(sprintf("%-20s%-10s%-10f%-10s%-10f",cartProduct[i],cartProductUnit[i],cartProductPrice[i],cartProductNum[i],subTotal))
			totalCost+=subTotal
		}
		console.log('Your total cost for today is :'+totalCost)			
		console.log('')
		console.log('Thank you for shopping at our market!')
		console.log('Have a nice day!')
		//complete this adventure
		dialog.complete()
	}
	else{
		console.log('It seems you want to continue shopping')
		console.log('')
		//continue shopping
		return askForIntention().then(customerIntents)
	}
}


/*Main program*/
console.log('Hello! Welcome to the market!')

greetings()
  .then(askForIntention)
  .then(customerIntents)
  .catch((err) => {
	  //print error	  
      console.log(err)
	  //complete this adventure
      dialog.complete()
    })
	
}