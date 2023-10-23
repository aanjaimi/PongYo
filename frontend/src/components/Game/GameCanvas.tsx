import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import { useSocket } from "@/contexts/socket-context";
import { useStateContext } from "@/contexts/state-context";
import type { User } from "@/types/user";
import type { itemPosition,GameCanvasProps } from "../gameTypes/types";
const GameCanvas = ({ setIsGameOver, setMyScore, setOppScore }:GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Specify the type for canvasRef
  const { gameSocket } = useSocket();
  const { dispatch } = useStateContext();
  useEffect(() => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const canvas = canvasRef.current ?? undefined;
    const renderOptions = {
      canvas: canvas,
      engine: engine,
      options: {
        width: 650,
        height: 750,
        wireframes: false,
        background: "white",
      },
    };
    const render = Matter.Render.create(renderOptions);
    const ball = Matter.Bodies.circle(325, 375, 10, {
      render: {
        fillStyle: "white",
        strokeStyle: "black", // Change the border color to red
        lineWidth: 4, // Adjust the border width
      },
    });
   
    const playerPaddle = Matter.Bodies.rectangle(325, 15, 150, 20, {
      isStatic: true,
      render: {
        fillStyle: "white",
        strokeStyle: "black",  // Border (stroke) color
        lineWidth: 3,
      },
      chamfer: {
        radius: 10,
      },
    });

    const opponentPaddle = Matter.Bodies.rectangle(325, 735, 150, 20, {
      isStatic: true,
      render: {
        fillStyle: "white",
        strokeStyle: "black",  // Border (stroke) color
        lineWidth: 3,
      },
      chamfer: {
        radius: 10,
      },
    });
   
    const blueball = Matter.Bodies.circle(500, 250, 25, {
      isStatic: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "blue", // Change the border color to red
        lineWidth: 1, // Adjust the border width
      },
    });
    const magentaball = Matter.Bodies.circle(500, 550, 25, {
      isStatic: true,
      render: {

        fillStyle: "transparent",
        strokeStyle: "magenta", // Change the border color to red
        lineWidth: 1, // Adjust the border width
      },
    });
    const redball = Matter.Bodies.circle(150, 550, 25, {
      isStatic: true,
      render: {
        fillStyle: "transparent", // Set to transparent to only show the border
        strokeStyle: "red", // Change the border color to red
        lineWidth: 1, // Adjust the border width
      }, // Adjust the border width
    });
    const tanball = Matter.Bodies.circle(150, 250, 25, {
      isStatic: true,
      render: {
        fillStyle: "transparent", // Set to transparent to only show the border
        strokeStyle: "tan", // Change the border color to red
        lineWidth: 1, // Adjust the border width
      }, // Adjust the border width
    });

    const net = Matter.Bodies.rectangle(325, 375, 650, 0.5, {
      isStatic: true,
      render: {
        fillStyle: "black",
      },
    });
    Matter.World.add(engine.world, [
      ball,
      playerPaddle,
      opponentPaddle,
      net,
      blueball,
      magentaball,
      redball,
      tanball,
    ]);
    Matter.Render.run(render);
    gameSocket.on("change-color", (data:{color:string}) => {
      ball.render.strokeStyle = data.color;
    }
    );
    gameSocket.on("update-ball-position", (data:itemPosition) => {
      Matter.Body.setPosition(ball, { x: data.x, y: data.y });
    });
    gameSocket.on("update-player-position", (data:itemPosition) => {
      Matter.Body.setPosition(playerPaddle, { x: data.x, y: data.y });
    });
    gameSocket.on("update-opponent-position", (data:itemPosition) => {
      Matter.Body.setPosition(opponentPaddle, { x: data.x, y: data.y });
    });
    gameSocket.on("update-score", (data:{myScore:number,oppScore:number}) => {
      setMyScore(data.myScore);
      setOppScore(data.oppScore);
    });
    gameSocket.on("game-over", (data:{user:User}) => {
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      // dispatch({ type: "SET_OPP", payload: data.opp });
      dispatch({ type: "SET_USER", payload: data.user });
      setIsGameOver(true);
    });
    const handleMousemove = (event:MouseEvent) => {
      if(canvas === undefined) return;
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      gameSocket.emit("update-player-position", {
        x: mouseX,
        y: playerPaddle.position.y,
      });
    };

    if (canvas !== undefined) {
      canvas.addEventListener("mousemove", handleMousemove);
    }
    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      if (canvas !== undefined) {
        canvas.removeEventListener("mousemove", handleMousemove);
      }
    };
  }, []);
  return (
    <div>
      <canvas ref={canvasRef} className="h-full w-full rounded-3xl border-4" />
    </div>
  );
};

export default GameCanvas;
