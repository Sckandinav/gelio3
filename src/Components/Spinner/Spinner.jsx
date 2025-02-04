import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from './Spinner.module.scss';

export const Spinner = () => {
  return (
    <div className={styles.overlay}>
      <ClipLoader size={60} color="#32a2a8" />
    </div>
  );
};
