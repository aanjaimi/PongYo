import React from "react";
import type {RadioButtonProps} from "../gameTypes/types";
const RadioButton = ({ value, label, onChange }:RadioButtonProps) => {
  return (
    <div className="flex space-x-4">
      <input type="radio" value={value} onChange={onChange} />
      <label className="">{label}</label>
    </div>
  );
};

export default RadioButton;