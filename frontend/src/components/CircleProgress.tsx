import React, { useState, useEffect } from "react";
import clsx from "clsx";

const CircleProgress = () => {
  const [progress, setProgress] = useState(75);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-32 h-32 relative">
      <div
        className="absolute top-0 left-0 w-full h-full border-4 border-gray-300 rounded-full"
      />
      <div
        className={clsx(
          "absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full animate-progress",
          {
            "animate-progress": progress !== 0,
          }
        )}
        style={{
          animationDuration: "1s",
          animationTimingFunction: "linear",
          animationIterationCount: "1",
          animationFillMode: "forwards",
          strokeDasharray: "calc(2 * 3.14159 * 24)",
          strokeDashoffset: `calc((100 - ${progress}) / 100 * (2 * 3.14159 * 24))`,
        }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-lg">
          <span
            className={clsx("text-primary", {
              "text-green-500": progress >= 70,
              "text-yellow-500": progress >= 30 && progress < 70,
              "text-red-500": progress < 30,
            })}
          >
            {progress}%
          </span>
        </p>
        <p className="text-xs">Complete</p>
      </div>
    </div>
  );
};

export default CircleProgress;
