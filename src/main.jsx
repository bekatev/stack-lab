import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { LabProvider } from './context/LabContext'
import { Lab } from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <LabProvider>
        <Lab />
      </LabProvider>
    </Provider>
  </React.StrictMode>
)
