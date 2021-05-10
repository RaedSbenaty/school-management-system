import React from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import { signUpTeacher } from "../../services/teacherService";

class Teacher extends Form {
  state = {
    account: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: "",
      birthDate: "",
      specification: "",
      graduationCollage: "",
      graduationYear: "",
    },
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: "",
      birthDate: "",
      specification: "",
      graduationCollage: "",
      graduationYear: "",
    },
  };

  schema = {
    firstName: Joi.string().required().label("name"),
    lastName: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    phoneNumber: Joi.number().required().label("phone number"),
    address: Joi.string().required().label("address"),
    birthDate: Joi.string().required().label("birth date"),
    specification: Joi.string().required().label("spacification"),
    graduationCollage: Joi.string().required().label("graduation collage"),
    graduationYear: Joi.number()
      .min(1921)
      .max(new Date().getFullYear())
      .required()
      .label("graduation year"),
  };

  completeSubmit = async () => {
    try {
      await signUpTeacher(this.state.account);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errors = { ...this.state.errors };
        errors["email"] = "teacher already exists";
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
      phoneNumber,
      address,
      birthDate,
      specification,
      graduationCollage,
      graduationYear,
    } = this.state.account;

    let errors = this.state.errors;

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
        {this.renderInput(
          "phoneNumber",
          phoneNumber,
          "Phone Number",
          errors.phoneNumber
        )}
        {this.renderDate(
          "birthDate",
          birthDate,
          "Birth Date",
          errors.birthDate
        )}
        {this.renderInput("address", address, "Address", errors.address)}
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
