import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import './App.css';

const App = () => {
  return (
    <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </switch>
      </section>
    </Fragment>
    </Router>
  );
}

export default App;
