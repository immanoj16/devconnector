import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {

  state = {
    email: '',
    password: '',
    errors: {}
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post('/api/users/login', user)
      .then(user => console.log(user))
      .catch(err => console.log(err.response.data));
  }

  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input type="email" value={this.state.email} className="form-control form-control-lg" placeholder="Email Address" name="email" onChange={this.onChange} />
                </div>
                <div className="form-group">
                  <input type="password" value={this.state.password} className="form-control form-control-lg" placeholder="Password" name="password" onChange={this.onChange} />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
