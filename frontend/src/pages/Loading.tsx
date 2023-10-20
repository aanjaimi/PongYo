import React from 'react'
import {CircularProgress} from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="border flex w-screen h-screen items-center justify-center">
      <CircularProgress className="border w-64 h-64" color="primary" aria-label="Loading..." />
    </div>
  )
}

export default Loading;
