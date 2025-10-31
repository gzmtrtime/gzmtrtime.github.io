import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css' // optional tailwind

// Ensure your index.html has a <div id="root"></div>
createRoot(document.getElementById('root')).render(<App />)

