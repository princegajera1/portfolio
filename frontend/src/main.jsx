import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'

// Silence all console logs in production for maximum performance and data privacy
if (import.meta.env.PROD) {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

// Register PWA Service Worker for offline asset caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(err => {
        // Fail silently or handle accordingly in standard environments
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
