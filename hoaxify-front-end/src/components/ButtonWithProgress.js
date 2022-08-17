import React from 'react'

export default function ButtonWithProgress(props) {
    const {onClick,pendingApiCall,disabled,text,className} = props;

  return (
    <button
    disabled={disabled}
    className={ className ||"btn btn-primary"}
    onClick={onClick}

  >
    {pendingApiCall && (
      <span className="spinner-border text-black spinner-border-sm" />
    )}
    {text}
  </button>
  )
}
