import { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
import Password from "./Password";
import Date from "./Date";

class Form extends Component {
  state = {};
  schema = {};

  handleChange = ({ currentTarget }) => {
    let account = { ...this.state.account };
    account[currentTarget.name] = currentTarget.value;

    let error = this.validateOneField(currentTarget);
    let errors = { ...this.state.errors };

    errors[currentTarget.name] = error;
    this.setState({ account, errors });
  };

  renderDate = (name, value, placeholder, error) => {
    return (
      <Date
        name={name}
        value={value}
        handleChange={this.handleChange}
        placeholder={placeholder}
        error={error}
      />
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let errors = this.validate();
    console.log(Object.keys(errors).length);
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      return;
    }
    this.customValidation();
  };

  renderSubmitButton = (text) => {
    return <button type="submit">{text}</button>;
  };

  renderInput = (name, value, placeholder, error, type = "text") => {
    return (
      <Input
        type={type}
        name={name}
        handleChange={this.handleChange}
        placeholder={placeholder}
        value={value}
        error={error}
      />
    );
  };

  renderPassword = (name, value, placeholder, error) => {
    return (
      <Password
        name={name}
        value={value}
        placeholder={placeholder}
        handleChange={this.handleChange}
        error={error}
      />
    );
  };

  validateOneField = (currentTarget) => {
    let validate = Joi.validate(
      currentTarget.value,
      this.schema[currentTarget.name],
      { abortEarly: false }
    );

    let error = validate.error;

    return error
      ? error.details[0].message
          .replaceAll('"', "")
          .replace("value", currentTarget.name)
      : "";
  };

  validate = () => {
    let validate = Joi.validate(this.state.account, this.schema, {
      abortEarly: false,
    });

    let errors = {};

    if (validate.error) {
      let details = validate.error.details;

      for (let error of details) {
        if (!errors[error.path]) {
          errors[error.path] = error.message.replaceAll('"', "");
        }
      }
    }
    return errors;
  };
}

export default Form;
