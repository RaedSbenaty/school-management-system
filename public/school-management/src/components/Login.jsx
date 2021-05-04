import loginpic from "../images/Fingerprint-bro.png";
import "../App.css";
import "../styles/form.css";
import React, { Component } from "react";
import Input from "./Input";
import Password from "./Password";
import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    account: { email: "", password: "" },
  };

  handleChange = ({ currentTarget }) => {
    let account = { ...this.state.account };
    account[currentTarget.name] = currentTarget.value;
    this.setState({ account });
  };

  handleSubmit = (event) => {
    event.preventDefault();
  };

  render() {
    const { email, password } = this.state.account;
    return (
      <div id="login">
        <div id="log-container">
          <div id="log-section">
            <h1>Log in</h1>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <Input
                type="email"
                name="email"
                value={email}
                handleChange={this.handleChange}
                placeholder="Email"
              />
              <Password value={password} handleChange={this.handleChande} />
              <button type="submit">Log in</button>
              <Link className="button" to="/signup">
                Back to sign up
              </Link>
            </form>
          </div>
        </div>

        <div id="pic-section">
          <img src={loginpic} alt="login image" />
        </div>
      </div>
    );
  }
}

export default Login;
