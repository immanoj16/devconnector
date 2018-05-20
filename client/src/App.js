import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';
import store from './reducers';
import './App.css';

if (localStorage.jwtToken) {
  // set token to Auth header
  setAuthToken(localStorage.jwtToken);
  // Decode the token to get user data
  const decoded = jwt_decode(localStorage.jwtToken);
  // set current user
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path='/' component={Landing} />
          <div className="container">
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
