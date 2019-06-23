import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import './App.css';
import Login from './component/login/login.js';
import Main from './component/main/main';

import axios from "axios";
axios.defaults.baseURL = "http://47.96.21.88:8086/";

// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// 响应拦截器
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    // console.log(response)
    return response.data;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/home" component={Main} />
          <Route path="/show" component={Show} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

const Show = () => {
  return <div>Show</div>
}

export default App;
