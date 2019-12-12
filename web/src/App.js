import React from 'react';
import { BrowserRouter, Route }  from 'react-router-dom';
import Home from './containers/home/Home';
import Login from './containers/login/Login';
import Product from './containers/product/Product';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';


function App() {
    // Add fontAwesome icons to the library
    library.add(faSearch)

    return (
        <BrowserRouter>
            <div className="App">
                <Route path="/" exact component={Home} />
                <Route path="/login" exact render={(props) => <Login {...props} login={true} />} />
                <Route path="/search" render={() => <h1>Hello</h1>} />
                <Route path="/product" render={(props) => <Product {...props} login={true} />} />
            </div>
        </BrowserRouter>
    );
}

export default App;
