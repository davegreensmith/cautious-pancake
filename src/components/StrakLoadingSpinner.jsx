import React from "react";
import styles from "../styling/StrakSpinner.module.css";
import spinningMantis from "../images/golf-spray.jpg";

export default function StrakLoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <img className={styles.mantis} src={spinningMantis}></img>
      </div>
    </div>
  );
}
