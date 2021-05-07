import loginpic from "../images/Fingerprint-bro.png";
import "../App.css";
import "../styles/form.css";
import React, { Component } from "react";
import Input from "./Input";
import Password from "./Password";
import { Link } from "react-router-dom";
import Form from "./Form";
import Joi from "joi-browser";

class Login extends Form {
  state = {
    account: { email: "", password: "" },
    errors: { email: "", password: "" },
  };

  schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  };

  render() {
    const { email, password } = this.state.account;
    const errors = this.state.errors;
    return (
      <div id="login">
        <div id="log-container">
          <div id="log-section">
            <h1>Log in</h1>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              {this.renderInput("email", email, "Email", errors.email, "email")}
              {this.renderPassword(
                "password",
                password,
                "Password",
                errors.password
              )}
              {this.renderSubmitButton("Log in")}
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
