import React from 'react';
import { Provider } from 'react-redux';
import store from './app/store';
import Dashboard from './features/Dashboard';
import './App.css';

function App() {

  return (
    <Provider store={store}>
      <div className='App'>
        <Dashboard />
      </div>
    </Provider>
  )
}

export default App
