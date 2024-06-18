import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{backgroundColor: "#c5c8c9"}} className='min-vh-100 d-flex flex-column'>
        <App />
    </div>
  </React.StrictMode>,
)
