import React from "react";
import "../styles/animate.css";

function Animate({ text }) {
  text = Array.from(text);

  return (
    <div id="animation-container">
      {text.map((letter) => (
        <span key={Math.random()}>{letter}</span>
      ))}
    </div>
  );
}

export default Animate;
