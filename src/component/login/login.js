import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Form } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./css/login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: "",
      pwd: ""
    };
  }

  handleSubmit = () => {
    const { history } = this.props;
    history.push("/home");
    axios
      .post("users/login", {
        uname: this.state.uname,
        pwd: this.state.pwd
      })
      .then(result => {
        // console.log(data.data)
        if (result.meta.status === 200) {
          // 存储token
          localStorage.setItem("mytoken", result.data.token);
          // 登录成功
          history.push("/home");
        }
      });
  };

  handleChange = event => {
    // 从原生DOM中获取属性：name 和 value
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { uname, pwd } = this.state;
    return (
      <div className="login-container">
        <div className="login-title">登录</div>
        <div className="login-form">
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              icon="user"
              required
              size="big"
              iconPosition="left"
              name="uname"
              value={uname}
              onChange={this.handleChange}
              placeholder="请输入用户名..."
            />
            <Form.Input
              type="password"
              icon="lock"
              required
              size="big"
              iconPosition="left"
              name="pwd"
              value={pwd}
              onChange={this.handleChange}
              placeholder="请输入密码..."
            />
            <Form.Button positive content="登录" />
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
