"use client";

import { motion } from "framer-motion";
import { Palette, Sprout, Camera, Activity, Pencil, Ghost } from "lucide-react";

export function LandingDecorations() {
  const icons = [
    { Icon: Palette, color: "text-blue-400", x: "10%", y: "20%", delay: 0 },
    { Icon: Sprout, color: "text-green-400", x: "85%", y: "15%", delay: 1 },
    { Icon: Camera, color: "text-yellow-400", x: "15%", y: "75%", delay: 2 },
    { Icon: Activity, color: "text-pink-400", x: "80%", y: "80%", delay: 3 },
    { Icon: Pencil, color: "text-purple-400", x: "50%", y: "85%", delay: 4 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, color, x, y, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-30`}
          initial={{ x: 0, y: 0 }}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
          style={{ left: x, top: y }}
        >
          <Icon className="w-16 h-16 md:w-24 md:h-24" />
        </motion.div>
      ))}
      
      <motion.div
        className="absolute top-1/4 right-[10%] opacity-20 hidden md:block"
        animate={{
            x: [0, 50, 0],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
        }}
      >
        <Ghost className="w-32 h-32 text-red-500" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-[10%] hidden md:block opacity-40"
        animate={{
          x: [0, 100, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-20 h-20 md:w-28 md:h-28 bg-yellow-400 rounded-full clip-pacman"></div>
        <style jsx>{`
          .clip-pacman {
            clip-path: polygon(100% 20%, 100% 0, 0 0, 0 100%, 100% 100%, 100% 80%, 50% 50%);
            animation: chomp 0.7s infinite linear alternate;
          }
          @keyframes chomp {
            0% {
              clip-path: polygon(100% 20%, 100% 0, 0 0, 0 100%, 100% 100%, 100% 80%, 50% 50%);
            }
            100% {
              clip-path: polygon(100% 50%, 100% 0, 0 0, 0 100%, 100% 100%, 100% 50%, 50% 50%);
            }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
