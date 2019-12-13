import React, { useState } from 'react';
import { BrowserRouter, Route }  from 'react-router-dom';
import Home from './containers/home/Home';
import Login from './containers/login/Login';
import Search from './containers/search/Search';
import Product from './containers/product/Product';
import Category from './containers/category/Category';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';


function App() {
    // Add fontAwesome icons to the library
    library.add(faSearch)

    const [isLoggedIn, setLogInStatus] = useState(false);

    let setAppStatus = (value) => {
        console.log(value);
        setLogInStatus(value);
    }

    return (
        <BrowserRouter>
            <div className="App">
                <Route path="/" exact component={Home} />
                <Route path="/login" exact render={(props) => <Login {...props} login={true} isLoggedIn={isLoggedIn} setStatus={setAppStatus} />} />
                <Route path="/product/:productId" exact render={(props) => <Product {...props} isLoggedIn={isLoggedIn} />} />
                <Route path="/search/:query" exact render={(props) => <Search {...props} isLoggedIn={isLoggedIn}/>} />
                <Route path="/category/:category" exact render={(props) => <Category {...props} isLoggedIn={isLoggedIn}/>} />
            </div>
        </BrowserRouter>
    );
}

export default App;
