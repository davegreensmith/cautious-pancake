import React from "react";
import { Link } from "react-router-dom";
import styles from "../styling/NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.navLink}>
        blog
      </Link>
      <Link to="/skills" className={styles.navLink}>
        skills
      </Link>
      <Link to="/portfolio" className={styles.navLink}>
        portfolio
      </Link>
      <Link to="/links" className={styles.navLink}>
        links
      </Link>
      <Link to="/strak/leaderboard" className={styles.navLink}>
        golfTrack
      </Link>
    </nav>
  );
}
