import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', glass = true }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`${glass ? 'card-glass' : 'card'} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;

