import React from "react";
import { Button } from "@/components/ui/button";

const CustomModal = ({ onClose }) => {
  return (
    <div className="fixed flex items-center justify-center ">
      <div className=" bg-white w-64 p-4 rounded-lg shadow-lg text-center">
        <p className="text-lg text-gray-700">Please select either 'Normal game Or 'Ranked game'  before starting</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 mt-4"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
