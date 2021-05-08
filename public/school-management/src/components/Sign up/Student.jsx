import React, { Component } from "react";
import Form from "../Form";
import Input from "../Input";
import Joi from "joi-browser";
import { Link } from "react-router-dom";

class Student extends Form {
  state = {
    account: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      address: "",
      fatherName: "",
      phoneNumber: "",
      motherName: "",
    },
    errors: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      address: "",
      fatherName: "",
      phoneNumber: "",
      motherName: "",
    },
  };

  schema = {
    name: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    birthDate: Joi.string().required().label("birth date"),
    address: Joi.string().required().label("address"),
    fatherName: Joi.string().required().label("father name"),
    motherName: Joi.string().required().label("mother name"),
    phoneNumber: Joi.number().required().label("phone number"),
  };

  customValidation = () => {
    let errors = { ...this.state.errors };
    errors["confirmPassword"] = "passwords don't match";
    this.setState({ errors });
  };

  render() {
    let {
      name,
      email,
      password,
      confirmPassword,
      birthDate,
      address,
      fatherName,
      motherName,
      phoneNumber,
    } = this.state.account;

    let { errors } = this.state;

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
        {this.renderInput("address", address, "Address", errors.address)}
        {this.renderInput(
          "fatherName",
          fatherName,
          "Father Name",
          errors.fatherName
        )}
        {this.renderInput(
          "motherName",
          motherName,
          "Mother Name",
          errors.motherName
        )}
        {this.renderInput(
          "phoneNumber",
          phoneNumber,
          "Phone Number",
          errors.phoneNumber
        )}
        {this.renderSubmitButton("Sign up")}
        <Link to="/login">Back to log in</Link>
      </form>
    );
  }
}

export default Student;
