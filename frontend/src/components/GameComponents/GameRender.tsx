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
    Matter.World.add(engine.world, []);
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
