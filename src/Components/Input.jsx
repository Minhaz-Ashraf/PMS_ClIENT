import React from "react";

const InputField = ({ type, className, value, name, onchange, placeholder, autocomplete}) => {
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
    
      />
    </>
  );
};

export default InputField;
