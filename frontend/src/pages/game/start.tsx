import React, { useState } from "react";
import GameCanvas from "@/components/Game/GameCanvas";
import GameResult from "@/components/GameResult/GameResult";
import { useEffect } from "react";
import ImageCard from "@/components/Game/imageCard";
import { Card } from "@/components/ui/card";
import type { User } from "@/types/user";
import { useRouter } from 'next/router';
import { useSocket } from "@/contexts/socket-context";


type GameProps = {
	oppData: User;
	isRanked: boolean;
};
const Game = ({ oppData, isRanked }: GameProps) => {
	const router = useRouter();
	const { query } = router;
	console.log(query);
	if (!query.opp) {

		return <div className="w-screen h-screen ">
			<div className="flex items-center justify-center h-screen">
				<h1 className="text-9xl text-black">404</h1>
				<h1 className="text-3xl text-black">Page not found</h1>
			</div>
		</div>;
	}

	const [isGameOver, setIsGameOver] = React.useState(false);
	const [myScore, setMyScore] = useState(0);
	const [oppScore, setOppScore] = useState(0);
	const [countdown, setCountdown] = useState(5);
	const { gameSocket } = useSocket();

	useEffect(() => {
		if (!gameSocket.connected) {
			gameSocket.connect();
		}
		const timer = setInterval(() => {
			if (countdown > 0) {
				setCountdown(countdown - 1);
			} else {
				clearInterval(timer);
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [countdown]);

	return (
		<Card className="flex justify-center items-center grow bg-white border">
			{countdown > 0 && (
				<div className="flex h-screen items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<h1 className="text-9xl text-black">{countdown}</h1>
						<h1 className="text-3xl text-black">Game starts in</h1>
					</div>
				</div>
			)}
			{!isGameOver && countdown <= 0 && (
				<div className="flex h-screen w-screen flex-col items-center justify-start sm:flex-row sm:justify-center">
					<ImageCard
						sideclass="h-full flex-col justify-start sm:w-auto w-full sm:flex  "
						className="mx-8 flex flex-col  justify-end items-end sm:justify-center  h-full sm:h-[50%] "
						score={myScore}
					/>
					<div className="flex items-center justify-center px-2 py-3 sm:py-20">
						<GameCanvas
							setIsGameOver={setIsGameOver}
							setMyScore={setMyScore}
							setOppScore={setOppScore}
							isRanked={isRanked}
						/>
					</div>
					<ImageCard
						sideclass="h-full flex-col justify-end sm:w-auto w-full sm:flex"
						className="mx-8 flex flex-col items-start justify-center sm:h-[50%]"
						score={oppScore}
					/>
				</div>
			)}
			{isGameOver && <GameResult myScore={myScore} oppScore={query.oppData} oppData={oppData} />}
		</Card>
	);
};

export default Game;
