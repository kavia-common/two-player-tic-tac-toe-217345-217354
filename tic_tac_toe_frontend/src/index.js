import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// CRA entrypoint: renders the Tic Tac Toe App to #root on port 3000 via npm start
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
