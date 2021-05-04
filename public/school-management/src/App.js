import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import Login from './components/Login';
import 'font-awesome/css/font-awesome.css'

class App extends Component {
  render() {
    return (
      <Route path="/login" component={Login} />
    );
  }
}

export default App;