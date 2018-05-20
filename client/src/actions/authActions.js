import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';

export const registerUser = (user, history) => dispatch => {
  axios.post('/api/users/register', user)
    .then(res => history.push('/login'))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
}

export const loginUser = user => dispatch => {
  axios.post('/api/users/login', user)
    .then(res => {
      // save to local storage
      const { token } = res.data;
      // set token to local storage
      localStorage.setItem('jwtToken', token);
      // set token to Auth header
      setAuthToken(token);
      // Decode the token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
}

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}
