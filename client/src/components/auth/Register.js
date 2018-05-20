import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {

  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, password2 } = this.state;

    const newUser = {
      name,
      email,
      password,
      password2
    }

    axios.post('/api/users/register', newUser)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }

  render() {
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input type="text" value={this.state.name} className="form-control form-control-lg" placeholder="Name" name="name" onChange={this.onChange} />
                </div>
                <div className="form-group">
                  <input type="email" value={this.state.email} className="form-control form-control-lg" placeholder="Email Address" name="email" onChange={this.onChange} />
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <input type="password" value={this.state.password} className="form-control form-control-lg" placeholder="Password" name="password" onChange={this.onChange} />
                </div>
                <div className="form-group">
                  <input type="password" value={this.state.password2} className="form-control form-control-lg" placeholder="Confirm Password" name="password2" onChange={this.onChange} />
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

export default Register;
