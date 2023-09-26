import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);
  useEffect(() => {
    const engine = Matter.Engine.create({gravity: { x: 0, y: 0 }});

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
    // adpay force to the ball
    const ball = Matter.Bodies.circle(325, 375, 10, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      inertia: Infinity,
      render: {
        fillStyle: "white",
      },
    });
    const playerPaddle = Matter.Bodies.rectangle(325, 15, 150, 20, {
      isStatic: true, // Make the player paddle non-static
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
    const wallLeft = Matter.Bodies.rectangle(0, 375, 1, 750, {
      isStatic: true,
      render: {
        fillStyle: "white",
      },
    });
    const wallRight = Matter.Bodies.rectangle(650, 375, 1, 750, {
      isStatic: true,
      render: {
        fillStyle: "white",
      },
    });
    const walltop = Matter.Bodies.rectangle(325, 0, 650, 1, {
      isStatic: true,
      render: {
        fillStyle: "white",
      },
    });
    const wallbottom = Matter.Bodies.rectangle(325, 750, 650, 1, {
      isStatic: true,
      render: {
        fillStyle: "white",
      },
    });
    Matter.World.add(engine.world, [ball, playerPaddle, opponentPaddle, wallLeft, wallRight , walltop, wallbottom]);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    // apply force to the ball
    Matter.Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 650, y: 750 },
    });
    Matter.Body.applyForce(ball, { x: 375, y: 325 }, { x: 0.0008, y: 0.005 });
    const canvas = canvasRef.current;

    // Add mousemove event listener to update the player paddle's position
    canvas.addEventListener("mousemove", (event) => {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      Matter.Body.setPosition(playerPaddle, { x: mouseX, y: playerPaddle.position.y });
    });
    Matter.Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        const { label: labelA } = pair.bodyA;
        const { label: labelB } = pair.bodyB;
        if (labelA === "ball" && labelB === "bottomWall") {
          setScore((score) => score + 1);
        }
        if (labelA === "ball" && labelB === "topWall") {
          setOpponentScore((opponentScore) => opponentScore + 1);
        }
      });
    }
    );

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      canvas.removeEventListener("mousemove", () => {});
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full rounded-3xl" />;
};

export default GameCanvas;