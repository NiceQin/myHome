import React from 'react';
import axios from 'axios';
import {withRouter} from "react-router-dom";

// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// 响应拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response)
    return response.data
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      pw: ''
    }
  }

  handleUsername = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  handlePw = (event) => {
    this.setState({
      pw: event.target.value
    });
  }

  handleSubmit = () => {
    const {history} = this.props;
    // console.log(this.state.username,this.state.pw)
    axios.post('http://47.96.21.88:8086/users/login',{
      uname: this.state.username,
      pwd: this.state.pw
    }).then(result=>{
      // console.log(data.data)
      if(result.meta.status === 200) {
        // 存储token
        localStorage.setItem('mytoken', result.data.token);
        // 登录成功
        history.push('/home');
      }
    });
  }

  render() {
    return (
      <div>
        <div>登录</div>
        <div>
          用户名：<input value={this.state.username} onChange={this.handleUsername} type="text" name="username"/>
        </div>
        <div>
          密码：<input value={this.state.pw} onChange={this.handlePw} type="password" name="pw"/>
        </div>
        <button onClick={this.handleSubmit}>登录</button>
      </div>
    );
  }
}

export default withRouter(Login);
