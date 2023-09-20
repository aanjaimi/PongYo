import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const GameRender = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 650,
        height: 750,
        wireframes: false,
        background: "#33437D",
      },
    });
    const ball = Matter.Bodies.circle(325, 375, 10, {
      render: {
        fillStyle: 'white', // Set the ball's fill color to red
      },
    });

    const playerpadle = Matter.Bodies.rectangle(325,15, 150, 20,{
      isStatic: true,
      render: {
        fillStyle: "#8D8DDA",
       },
       chamfer: {
        radius: 10,
      },
    });

    const opentpadle = Matter.Bodies.rectangle(325, 735, 150, 20, {
      isStatic: true,
      render: {
        fillStyle: "#8D8DDA",
      },
      chamfer: {
        radius: 10,
      },
    });
    const horizontalLine = Matter.Bodies.rectangle(325, 375, 650, 1, {
      isStatic: true,
      render: {
        fillStyle: 'white',
      },
    });
    Matter.World.add(engine.world, [ball, playerpadle, opentpadle , horizontalLine]);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);
  return <canvas ref={canvasRef} className="w-full h-full rounded-3xl" />;
};

export default GameRender;
