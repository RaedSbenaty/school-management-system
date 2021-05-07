import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import Login from './components/Login';
import 'font-awesome/css/font-awesome.css'
import Signup from './components/Sign up/Signup';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    );
  }
}

export default App;