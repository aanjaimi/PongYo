import React from "react";
type VsCardProps = {
  myScore: number;
  oppScore: number;
};
const VsCard = ({ myScore, oppScore }:VsCardProps) => {
	return (
		<div className="flex items-center flex-col">
          <div className="relative">
            <div className="animate-bounce flex flec-co">
              <span className="sm:text-5xl text-4xl font-bold mx-1">V</span>
              <span className="sm:text-6xl text-5xl font-bold text-blue-500 animate-pulse">S</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="sm:text-4xl  text-3xl animate-pulse text-blue-500">Score</p>
            <div className="sm:text-4xl text-2xl font-bold">
              {myScore} - {oppScore}
            </div>
          </div>
          <div className="pt-1">
            <button className=" text-xl sm:text-2xl font-bold text-blue-500 "
            onClick={() => {
              window.location.reload();
            }
            }
            >Leave</button>

          </div>
        </div>
	);
}
export default VsCard;