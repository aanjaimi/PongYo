import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import { useSocket } from "@/contexts/socket-context";
import { useStateContext } from "@/contexts/state-context";

const GameCanvas = ({ setIsGameOver, setMyScore, setOppScore }) => {
  const canvasRef = useRef();
  const { gameSocket } = useSocket();
  const { dispatch } = useStateContext();
  useEffect(() => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });

    const canvas = canvasRef.current;
    const renderOptions = {
      canvas: canvas,
      engine: engine,
      options: {
        width: 650,
        height: 750,
        wireframes: false,
        background: "#33437D",
      },
    };
    const render = Matter.Render.create(renderOptions);
    const createWall = (x, y, width, height, isStatic) => {
      return Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: isStatic,
        render: {
          fillStyle: "#33437D",
        },
      });
    };
    const ball = Matter.Bodies.circle(325, 375, 10, {
      render: {
        fillStyle: "white",
      },
    });

    const playerPaddle = Matter.Bodies.rectangle(325, 15, 150, 20, {
      isStatic: true,
      render: {
        fillStyle: "#8D8DDA",
      },
      chamfer: {
        radius: 10,
      },
    });

    const opponentPaddle = Matter.Bodies.rectangle(325, 735, 150, 20, {
      isStatic: true,
      render: {
        fillStyle: "#8D8DDA",
      },
      chamfer: {
        radius: 10,
      },
    });

    const walls = [
      createWall(0, 375, 1, 750, true),
      createWall(650, 375, 1, 750, true),
      createWall(325, 0, 650, 1, true),
      createWall(325, 750, 650, 1, true),
    ];
    const net = Matter.Bodies.rectangle(325, 375, 650, 0.5, {
      isStatic: true,
      render: {
        fillStyle: "white",
      },
    });

    Matter.World.add(engine.world, [
      ball,
      playerPaddle,
      opponentPaddle,
      ...walls,
      net,
    ]);
    Matter.Render.run(render);
    gameSocket.on("updateBallPosition", (data) => {
      Matter.Body.setPosition(ball, { x: data.x, y: data.y });
    });
    gameSocket.on("updatePlayerPosition", (data) => {
      console.log("here where player position is updated");
      console.log(data);
      Matter.Body.setPosition(playerPaddle, { x: data.x, y: data.y });
    });
    gameSocket.on("updateOpponentPosition", (data) => {
      console.log("here where opponent position is updated");
      console.log(data);
      Matter.Body.setPosition(opponentPaddle, { x: data.x, y: data.y });
    });
    gameSocket.on("updateScore", (data) => {
      console.log("here where score is updated");
      console.log(data);
      setMyScore(data.myScore);
      setOppScore(data.oppScore);
    });
    gameSocket.on("gameOver", (data) => {
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      // dispatch({ type: "SET_OPP", payload: data.opp });
      dispatch({ type: "SET_USER", payload: data.user });
      
      
      setIsGameOver(true);
    });
    const handleMousemove = (event) => {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      gameSocket.emit("updatePlayerPosition", {
        x: mouseX,
        y: playerPaddle.position.y,
      });
    };

    if (canvas !== null) {
      canvas.addEventListener("mousemove", handleMousemove);
    }

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      if (canvas !== null) {
        canvas.removeEventListener("mousemove", handleMousemove);
      }
    };
  }, []);
  return (
    <div>
      <canvas ref={canvasRef} className="h-full w-full rounded-3xl" />
    </div>
  );
};

export default GameCanvas;
