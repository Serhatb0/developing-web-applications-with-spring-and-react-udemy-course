import React from "react";

const Input = (props) => {
  const { label, error, name, onChange ,type ,defaultValue} = props;
  let className = 'form-control';
  if(type === 'file'){
    className += "-file";
  }
  if(error !== undefined){
    className += ' is-invalid'
  }
  return (
    <div className="form-group">
      <label>{label}</label>
      <input defaultValue={defaultValue} type={type}
       className={className} 
       name={name} onChange={onChange} />
      <div className="invalid-feedback">{error}</div>
    </div>
  );
};

export default Input;
