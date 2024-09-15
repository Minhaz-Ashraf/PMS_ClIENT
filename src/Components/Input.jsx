import React from "react";

const InputField = ({ type, className, value, name, onchange, placeholder, autocomplete, max}) => {
  return (
    <>
      <input
        type={type}
        className={className}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onchange}
        autoComplete={autocomplete}
        max={max}
    
      />
    </>
  );
};

export default InputField;
