import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import './App.css';
import Login from './login.js';
import Main from './modules/main.js';
import axios from 'axios';
axios.defaults.baseURL = 'http://47.96.21.88:8086/';
// axios.defaults.baseURL = 'http://127.0.0.1:8086/';

// 请求拦截器
axios.interceptors.request.use(function (config) {
    if(!config.url.endsWith('/login')){
      // 登录的地址不需要添加token请求头
      config.headers.Authorization = localStorage.getItem('mytoken');
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// 响应拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response)
    return response.data
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
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
