import React from "react";

const RadioButton = ({ value, label, onChange }) => {
  return (
    <div className="flex space-x-4">
      <input type="radio" value={value} onChange={onChange} />
      <label className="">{label}</label>
    </div>
  );
};

export default RadioButton;