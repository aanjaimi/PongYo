import React from "react";

const VsCard = ({ myScore, oppScore }) => {
	return (
		<div className="flex items-center flex-col">
          <div className="relative">
            <div className="animate-bounce flex flec-co">
              <span className="text-5xl font-bold mx-1">V</span>
              <span className="text-6xl font-bold text-blue-500 animate-pulse">S</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-4xl animate-pulse text-blue-500">Score</p>
            <div className="text-4xl font-bold">
              {myScore} - {oppScore}
            </div>
          </div>
          <div className="pt-1">
            <button className="text-2xl font-bold text-blue-500 "
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