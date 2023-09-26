import React, { useEffect, useState } from 'react';
import  ImageCard  from './imageCard';
import GameCanvas from './GameCanvas';
const Game = () =>
{
	const [myScore, setScore] = useState(0);
	const [oppScore, setOppScore] = useState(0);
return(
	<div className="flex flex-col sm:flex-row w-screen h-screen items-center justify-start  sm:justify-center">
	<div className=" w-full flex sm:hidden  justify-between items-center p-2 mt-10">

		<ImageCard sideclass=" flex-col  "className=" flex items-center justify-start mx-8" size={75} score={myScore}/>
		<ImageCard sideclass=" flex-col " className=" flex items-center justify-end mx-8" size={75} score={oppScore} />
	</div>
 <ImageCard sideclass="h-full flex-col justify-start   hidden sm:flex" className="h-[50%] flex items-end  justify-center mx-8 flex-col" score={myScore}/>
	<div className={`flex justify-center items-center py-5 px-2 sm:py-20`}>
		<GameCanvas setScore={setScore} setOppScore={setOppScore} myScore={myScore} oppScore={oppScore} />
	</div>
	<ImageCard sideclass="h-full flex-col justify-end hidden sm:flex" className="h-[50%] flex items-start justify-center mx-8 flex-col" score={oppScore}/>
</div>
)};
export default Game;