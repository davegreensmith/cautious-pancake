import React from "react";
import styles from "../styling/StrakHeader.module.css";
import golfSpray from "../images/golf-spray.jpg";

export default function StrakHeader() {
  return (
    <section className={styles.section}>
      <img src={golfSpray} alt="spraying mantis"></img>
      <h1 className={styles.header}>Score Tracker App</h1>
    </section>
  );
}
