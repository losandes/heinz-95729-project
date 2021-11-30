function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart-number-tracking span').textContent = productNumbers;
    }
}

function setItems(currentBook) {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);


    console.log("my cartitems are", cartItems);

    if (cartItems != null) {
        if (cartItems[currentBook.id] == undefined) {
            cartItems = {
                ...cartItems,
                [currentBook.id]: currentBook
            };

            currentBook.inCart = 1;

            if (productNumbers) {
                localStorage.setItem('cartNumbers', productNumbers + 1);
                document.querySelector('.cart-number-tracking span').textContent = productNumbers + 1;
            } else {
                localStorage.setItem('cartNumbers', 1);
                document.querySelector('.cart-number-tracking span').textContent = 1;
            }

            totalCost(currentBook);
        } else {
            alert('This item is already added to the cart')
            return
        }

    } else {
        currentBook.inCart = 1;
        cartItems = {
            [currentBook.id]: currentBook
        };

        if (productNumbers) {
            localStorage.setItem('cartNumbers', productNumbers + 1);
            document.querySelector('.cart-number-tracking span').textContent = productNumbers + 1;
        } else {
            localStorage.setItem('cartNumbers', 1);
            document.querySelector('.cart-number-tracking span').textContent = 1;
        }

        totalCost(currentBook);
    }

    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}


function totalCost(currentBook) {
    let cartCost = localStorage.getItem("totalCost");

    if (cartCost != null) {
        cartCost = parseFloat(cartCost);
        localStorage.setItem("totalCost", cartCost + currentBook.price);
    } else {
        localStorage.setItem("totalCost", currentBook.price);
    }
}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    let productContainer = document.querySelector('.products');

    console.log(productContainer);

    if (cartItems && productContainer) {
        console.log("checkout running");
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
                    <div class = "product">
                    <ion-icon name="close-circle"></ion-icon>
                    
                    <span>${item.title}</span>
                    </div>
                    `
        })
    }

}







onLoadCartNumbers();
displayCart();