import React, { Component } from "react";
import Animate from "./Animate";
import Form from "./Form";
import List from "./List";

class Signup extends Form {
  state = {
    items: ["School", "Teacher", "Student"],
  };
  render() {
    return (
      <div id="signup">
        <Animate text="Join Us" />
        <List items={this.state.items} />
      </div>
    );
  }
}

export default Signup;
