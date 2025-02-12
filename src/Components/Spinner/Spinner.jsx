import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { motion, AnimatePresence } from 'motion/react';
import styles from './Spinner.module.scss';

export const Spinner = () => {
  return (
    <AnimatePresence>
      <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <ClipLoader size={60} color="#32a2a8" />
      </motion.div>
    </AnimatePresence>
  );
};
