import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white"
    >
      <div className="z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold mb-4"
        >
          Bold Ideas. Beautiful Execution.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl mb-8"
        >
          Your design workflow, in one place.
        </motion.p>
        <a
          href="#projects"
          className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-200 transition"
        >
          View Projects
        </a>
      </div>
    </section>
  );
};

export default Hero;