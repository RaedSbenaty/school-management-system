import React, { Component } from "react";
import Input from "./Input";
import "font-awesome/css/font-awesome.css";

class Password extends Component {
  state = { opened: true, type: "password" };

  handleEye = () => {
    let opened = !this.state.opened;
    let type = opened ? "password" : "text";
    this.setState({ opened, type });
  };

  determineClasses = () => {
    let className = "fa fa-eye";
    return this.state.opened ? className : (className += "-slash");
  };

  render() {
    return (
      <div id="eye-container">
        <Input
          type={this.state.type}
          name={this.props.name}
          value={this.props.password}
          handleChange={this.props.handleChange}
          placeholder={this.props.placeholder}
          isPassword="password"
          error={this.props.error}
        />
        <div className="eye">
          <i className={this.determineClasses()} onClick={this.handleEye}></i>
        </div>
      </div>
    );
  }
}

export default Password;
