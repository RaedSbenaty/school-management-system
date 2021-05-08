import React, { Component } from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";

class School extends Form {
  state = {
    account: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      openingDate: "",
    },
    errors: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      openingDate: "",
    },
  };

  schema = {
    name: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    location: Joi.string().required().label("location"),
    openingDate: Joi.string().required().label("opening date"),
  };

  render() {
    let {
      name,
      email,
      password,
      confirmPassword,
      location,
      openingDate,
    } = this.state.account;

    let errors = this.state.errors;

    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        {this.renderInput("name", name, "Name", errors.name)}
        {this.renderInput("email", email, "Email", errors.email, "email")}
        {this.renderPassword("password", password, "Password", errors.password)}
        {this.renderPassword(
          "confirmPassword",
          confirmPassword,
          "Confirm Password",
          errors.confirmPassword
        )}
        {this.renderInput("location", location, "Location", errors.location)}
        {this.renderDate(
          "openingDate",
          openingDate,
          "Opening Date",
          errors.openingDate
        )}
        {this.renderSubmitButton("Sign up")}
        <Link to="/login">Back to log in</Link>
      </form>
    );
  }
}

export default School;
