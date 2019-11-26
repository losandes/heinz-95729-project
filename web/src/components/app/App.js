import React from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from './header/Header';

function App() {
  // Add fontAwesome icons to the library
  library.add(faSearch)

  return (
    <div className="App">
      <Header>

      </Header>
    </div>
  );
}

export default App;
