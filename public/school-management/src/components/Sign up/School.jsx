import React from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { signUpSchool } from "../../services/schoolService";

class School extends Form {
  state = {
    account: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      phoneNumber: "",
      facebookPage: "",
      openingDate: "",
    },
    errors: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      phoneNumber: "",
      facebookPage: "",
      openingDate: "",
    },
  };

  completeSubmit = async () => {
    try {
      await signUpSchool(this.state.account);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errors = { ...this.state.errors };
        errors["email"] = "school already exists";
        this.setState({ errors });
      }
    }
  };

  schema = {
    name: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    location: Joi.string().required().label("location"),
    phoneNumber: Joi.number().required().label("phone number"),
    facebookPage: Joi.string().uri().label("facebook page"),
    openingDate: Joi.string().required().label("opening date"),
  };

  render() {
    let {
      name,
      email,
      password,
      confirmPassword,
      location,
      phoneNumber,
      facebookPage,
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
        {this.renderInput(
          "phoneNumber",
          phoneNumber,
          "Phone Number",
          errors.phoneNumber
        )}
        {this.renderInput(
          "facebookPage",
          facebookPage,
          "Facebook Page",
          errors.facebookPage
        )}
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
