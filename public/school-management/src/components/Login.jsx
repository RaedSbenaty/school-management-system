import loginpic from "../images/Fingerprint-bro.png";
import "../App.css";
import "../styles/form.css";
import React from "react";
import { Link } from "react-router-dom";
import Form from "./Form";
import Joi from "joi-browser";
import { login } from "../services/loginService";

class Login extends Form {
  state = {
    account: { email: "", password: "" },
    errors: { email: "", password: "" },
  };

  schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  };

  completeSubmit = async () => {
    try {
      await login(this.state.account);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errors = { ...this.state.errors };
        errors["email"] = "failed to log in";
        errors["password"] = "failed to log in";
        this.setState({ errors });
      }
    }
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
          <img src={loginpic} alt="login" />
        </div>
      </div>
    );
  }
}

export default Login;
