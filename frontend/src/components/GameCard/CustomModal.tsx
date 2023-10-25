import React from "react";
import { Button } from "@/components/ui/button"
type CustomModalProps = {
  onClose: () => void;
};
const CustomModal = ({ onClose }: CustomModalProps) => {
  return (
    <div className="fixed flex items-center justify-center ">
      <div className=" bg-white w-64 p-4 rounded-lg shadow-lg text-center">
        <p className="text-lg text-gray-700">{`Please select either "Normal game" Or "Ranked game"  before starting`}</p>
        <Button
          className="px-4 py-2 text-white rounded-full"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CustomModal;
