import React from "react";
type RadioButtonProps = {
  value: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const RadioButton = ({ value, label, onChange }:RadioButtonProps) => {
  return (
    <div className="flex space-x-4">
      <input type="radio" value={value} onChange={onChange} />
      <label className="">{label}</label>
    </div>
  );
};

export default RadioButton;