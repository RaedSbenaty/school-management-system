import React from "react";

function Input({ type, name, value, handleChange, placeholder, isPassword }) {
  return (
    <input
      id={isPassword}
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}
export default Input;
