import React, { useRef } from 'react';
import styles from './Congratulations.module.scss';

export const Congratulations = () => {
  const videoRef = useRef(null);

  // 23 февраля
  //   return (
  //     <div className={styles.videoInner}>
  //       <video ref={videoRef} loop muted autoPlay playsInline className={styles.video}>
  //         <source src="./vecteezy_russia-flag-seamless-looping-background-looped-bump-texture_21086329.mp4" />
  //       </video>

  //       <p className={styles.text}>С Днем Защитника Отечества!</p>
  //     </div>
  //   );

  // 8 марта
  return (
    <div className={styles.postcard}>
      <div className={styles.imageInner}>
        <img className={styles.img} src="./flowers.png" alt="flowers" />
      </div>
      <p className={styles.textContent}>С 8 марта!</p>
    </div>
  );
};
