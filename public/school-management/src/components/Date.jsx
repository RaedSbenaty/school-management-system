import React, { useState } from "react";

function Date({ name, value, handleChange, placeholder, error }) {
  let [type, editType] = useState("text");

  return (
    <div id="form-control">
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => editType("date")}
        onBlur={() => {
          if (value) {
            placeholder = value;
            editType("text");
          }
        }}
        placeholder={placeholder}
      />

      <div id="error">{error}</div>
    </div>
  );
}

export default Date;
