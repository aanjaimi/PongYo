import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import io from "socket.io-client";

const GameCanvas = ({ setMyScore, setOppScore, myScore, oppScore }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // const socket = io('http://localhost:5000');
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

    Matter.World.add(engine.world, [ball, playerPaddle, opponentPaddle, ...walls]);
    Matter.Render.run(render);
    socket.on('ballPosition', (data) => {
      Matter.Body.setPosition(ball, { x: data.x, y: data.y });
    }
    );
    const handleMousemove = (event) => {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      Matter.Body.setPosition(playerPaddle, { x: mouseX, y: playerPaddle.position.y });
      socket.emit('updatePlayerPosition', { x: mouseX, y: playerPaddle.position.y });
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

  return <canvas ref={canvasRef} className="w-full h-full rounded-3xl" />;
};

export default GameCanvas;
