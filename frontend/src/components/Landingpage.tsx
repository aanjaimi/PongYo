import React from 'react';
import Card from './Card';

const Landingpage = () => {
  return (
    <div className="w-screen h-screen grid grid-cols-3">
      <div className="border rounded-br-full w-[250px] h-[250px] bg-[#8D8DDA] blur-[150px]"></div>
      <div className="flex justify-center mt-[30vh]"><Card /></div>
      <div className="flex justify-end items-end"><div className="border rounded-tl-full w-[250px] h-[250px] bg-[#ABD9D9] blur-[150px]"></div></div>
    </div>
  );
}

export default Landingpage;