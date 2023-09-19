import React, { useEffect, useState } from "react";
import Image from "next/image";
import GameRender from "../../components/GameComponents/GameRender";
import ImageCard from "../../components/GameComponents/imageCard";

const Game = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row w-screen h-screen items-center justify-start  sm:justify-center">
     
       <ImageCard sideclass="h-full flex-col justify-start   hidden sm:flex" className="h-[50%] flex items-center  justify-end mx-8"/>
        <div className={`flex justify-center items-center py-5 px-2 sm:py-20`}>
          <GameRender />
        </div>
        <ImageCard sideclass="h-full flex-col justify-end hidden sm:flex" className="h-[50%] flex items-center justify-start mx-8"/>
      </div>
    </>
  );
};

export default Game;
