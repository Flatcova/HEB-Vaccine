import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const api = axios.get('https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json', 
{ headers: { 
  'Access-Control-Allow-Origin': 'https://vaccine.heb.com',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
  }
})

export class App extends Component {
  constructor() {
    super();
    api.then(res => {
      console.log(res.data);
    })
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

export default App;
