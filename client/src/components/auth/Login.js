import React, { useState } from 'react'

const Login = () => {
        const [formData, setFormData] = useState({
            email: '',
            password: ''
        });

        const {email, password} = formData;

        const onChange = e => {
            setFormData({...formData, [e.target.email]: e.target.value});
        }

        const onSubmit = async s => {
            s.preventDefault();
            alert("Logged in");
        }

    return (
        <div>
    <section className="container">
      <div className="alert alert-danger">
        Invalid credentials
      </div>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength= '6'
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <a href="register.html">Sign Up</a>
      </p>
    </section>
        </div>
    )
}

export default Login