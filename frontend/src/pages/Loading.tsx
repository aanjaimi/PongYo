import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center border">
      <ReactLoading type="spin" color="#0000FF" height={100} width={100} />
    </div>
  );
};

export default Loading;
