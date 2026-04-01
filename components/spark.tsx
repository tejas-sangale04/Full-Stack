"use client"

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const SparkBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options: ISourceOptions = {
    fullScreen: { enable: false }, 
    fpsLimit: 150,
    particles: {
      number: { 
        value: 150, 
        density: { 
          enable: true
        } 
      },
      color: { value: ["#f4723bff", "#ffae00", "#ffffff"] }, // Fire colors
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.7, max: 1.5 },
        animation: { enable: true, speed: 7, sync: false }
      },
      size: { value: { min: 1, max: 6 } },
      move: {
        enable: true,
        speed: 7,
        direction: "top", // Sparks float up
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    detectRetina: true,
  };

  if (init) {
    return <Particles id="tsparticles" options={options} className="absolute inset-0 z-0" />;
  }
  return null;
};

export default SparkBackground;
