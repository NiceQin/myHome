import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import './App.css';
import Login from './component/login/login.js';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" exact component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/show" component={Show} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

const Home = () => {
  return <div>Home</div>
}
const Show = () => {
  return <div>Show</div>
}

export default App;
