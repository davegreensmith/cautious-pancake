import { Link } from "react-router-dom";
import styles from "../styling/StrakNav.module.css";

export default function StrakNav() {
  return (
    <nav className={styles.nav}>
      <Link to="/strak/leaderboard" className={styles.navLink}>
        Leader Board
      </Link>
      <Link to="/strak/scores" className={styles.navLink}>
        Enter Scores
      </Link>
      <Link to="/strak/history" className={styles.navLink}>
        Previous Scores
      </Link>
      <Link to="/strak/players" className={styles.navLink}>
        Player List
      </Link>
    </nav>
  );
}
