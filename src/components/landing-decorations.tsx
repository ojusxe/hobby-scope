"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const hobbyImages = [
  { src: "/hobbyist-otis/painting.png", x: "8%", y: "15%", delay: 0, size: 80 },
  { src: "/hobbyist-otis/gaming.png", x: "85%", y: "12%", delay: 1, size: 90 },
  { src: "/hobbyist-otis/cooking.png", x: "12%", y: "70%", delay: 2, size: 85 },
  { src: "/hobbyist-otis/piano.png", x: "82%", y: "75%", delay: 3, size: 80 },
  { src: "/hobbyist-otis/reading.png", x: "5%", y: "45%", delay: 4, size: 75 },
  { src: "/hobbyist-otis/basketball.png", x: "88%", y: "45%", delay: 5, size: 85 },
  { src: "/hobbyist-otis/garden.png", x: "25%", y: "85%", delay: 6, size: 70 },
  { src: "/hobbyist-otis/singing.png", x: "70%", y: "88%", delay: 7, size: 75 },
  { src: "/hobbyist-otis/poker.png", x: "15%", y: "30%", delay: 8, size: 70 },
];

export function LandingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hobbyImages.map(({ src, x, y, delay, size }, index) => (
        <motion.div
          key={index}
          className="absolute opacity-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.4,
            scale: 1,
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            opacity: { duration: 0.5, delay: delay * 0.15 },
            scale: { duration: 0.5, delay: delay * 0.15 },
            y: { duration: 6, repeat: Infinity, delay: delay * 0.3, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, delay: delay * 0.3, ease: "easeInOut" }
          }}
          style={{ left: x, top: y }}
        >
          <Image 
            src={src} 
            alt="" 
            width={size} 
            height={size}
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}
