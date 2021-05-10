import React from "react";
import { Route } from "react-router";
import Animate from "../Animate";
import Form from "../Form";
import List from "../List";
import School from "./School";
import Student from "./Student";
import Teacher from "./Teacher";
import signuppic from "../../images/signup.png";

class Signup extends Form {
  state = {
    items: ["School", "Teacher", "Student"],
  };

  componentDidMount() {
    this.props.history.replace("/signup/school");
  }

  render() {
    return (
      <div id="signup">
        <div id="sign-section">
          <Animate text="Join Us" />
          <List items={this.state.items} />
          <Route exact path="/signup/teacher" component={Teacher} />
          <Route exact path="/signup/student" component={Student} />
          <Route exact path="/signup/school" component={School} />
        </div>

        <div id="sign-pic-section">
          <div id="image-container">
            <img src={signuppic} alt="signup" />
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
