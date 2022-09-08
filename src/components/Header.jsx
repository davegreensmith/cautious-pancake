import React from "react";
import logo from "../images/logo.png";
import styles from "../styling/Header.module.css";

export default function Header() {
  return (
    <section className={styles.section}>
      <img src={logo} alt="logo" className={styles.logo} />
      <h1 className={styles.h1}>Greensmith online</h1>
    </section>
  );
}
