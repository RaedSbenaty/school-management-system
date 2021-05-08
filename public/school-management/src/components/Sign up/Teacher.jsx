import React, { Component } from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";

class Teacher extends Form {
  state = {
    account: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      specification: "",
      graduationCollage: "",
      graduationYear: "",
    },
    errors: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      specification: "",
      graduationCollage: "",
      graduationYear: "",
    },
  };

  schema = {
    name: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    birthDate: Joi.string().required().label("birth date"),
    specification: Joi.string().required().label("spacification"),
    graduationCollage: Joi.string().required().label("graduation collage"),
    graduationYear: Joi.number()
      .min(1921)
      .max(new Date().getFullYear())
      .required()
      .label("graduation year"),
  };

  render() {
    let {
      name,
      email,
      password,
      confirmPassword,
      birthDate,
      specification,
      graduationCollage,
      graduationYear,
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
        {this.renderDate(
          "birthDate",
          birthDate,
          "Birth Date",
          errors.birthDate
        )}
        {this.renderInput(
          "specification",
          specification,
          "Specification",
          errors.specification
        )}
        {this.renderInput(
          "graduationCollage",
          graduationCollage,
          "Graduation Collage",
          errors.graduationCollage
        )}
        {this.renderInput(
          "graduationYear",
          graduationYear,
          "Graduation Year",
          errors.graduationYear
        )}
        {this.renderSubmitButton("Sign Up")}
        <Link to="/login">Back to log in</Link>
      </form>
    );
  }
}

export default Teacher;
