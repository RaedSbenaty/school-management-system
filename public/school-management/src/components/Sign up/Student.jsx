import React from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import { signUpStudent } from "../../services/studentService";
import axios from "axios";

class Student extends Form {
  state = {
    account: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      fatherName: "",
      motherName: "",
      address: "",
      phoneNumber: "",
      lastSchoolAttended: "",
      previousClass: "",
    },
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      address: "",
      fatherName: "",
      phoneNumber: "",
      motherName: "",
      lastSchoolAttended: "",
      previousClass: "",
    },
  };

  schema = {
    firstName: Joi.string().required().label("first name"),
    lastName: Joi.string().required().label("last name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    birthDate: Joi.string().required().label("birth date"),
    address: Joi.string().required().label("address"),
    fatherName: Joi.string().required().label("father name"),
    motherName: Joi.string().required().label("mother name"),
    phoneNumber: Joi.number().required().label("phone number"),
    lastSchoolAttended: Joi.string().required().label("previous school"),
    previousClass: Joi.string().required().label("previous class"),
  };

  customValidation = () => {
    let errors = { ...this.state.errors };
    errors["confirmPassword"] = "passwords don't match";
    this.setState({ errors });
  };

  completeSubmit = async () => {
    try {
      await signUpStudent(this.state.account);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errors = { ...this.state.errors };
        errors["email"] = "student already exists";
        this.setState({ errors });
      }
    }
  };

  render() {
    let {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      birthDate,
      address,
      fatherName,
      motherName,
      phoneNumber,
      lastSchoolAttended,
      previousClass,
    } = this.state.account;

    let { errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        {this.renderInput(
          "firstName",
          firstName,
          "First Name",
          errors.firstName
        )}
        {this.renderInput("lastName", lastName, "Last Name", errors.lastName)}
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
        {this.renderInput(
          "lastSchoolAttended",
          lastSchoolAttended,
          "Previous School",
          errors.lastSchoolAttended
        )}
        {this.renderInput(
          "previousClass",
          previousClass,
          "Previous Class",
          errors.previousClass
        )}
        {this.renderSubmitButton("Sign up")}
        <Link to="/login">Back to log in</Link>
      </form>
    );
  }
}

export default Student;
