import React from "react";

function Input({
  type,
  name,
  value,
  handleChange,
  placeholder,
  isPassword,
  error,
}) {
  return (
    <div id="form-control">
      <input
        id={isPassword}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div id="error">{error}</div>
    </div>
  );
}
export default Input;
