import React, { Component } from "react";

class List extends Component {
  state = {
    active: 0,
  };

  handleClick = (index) => {
    console.log(index);
    this.setState({ active: index });
  };

  determineClass = (index) => {
    return this.state.active === index ? "active" : "";
  };

  render() {
    return (
      <ul>
        {this.props.items.map((item, index) => (
          <li
            className={this.determineClass(index)}
            onClick={() => this.handleClick(index)}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }
}

export default List;
