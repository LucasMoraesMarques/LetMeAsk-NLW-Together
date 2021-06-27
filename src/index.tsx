import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './services/firebase';

import './styles/global.scss'
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
