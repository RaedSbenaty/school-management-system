import { Component } from "react";
import Joi from "joi-browser";

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

  handleSubmit = (event) => {
    event.preventDefault();
    let errors = this.validate();
    if (Object.keys(errors) !== 0) {
      this.setState({ errors });
      return;
    }
  };

  renderSubmitButton = (text) => {
    return (
      <button type="submit" disabled={Object.keys(this.validate()) === 0}>
        {text}
      </button>
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
