import React from "react";
import { Link } from "react-router-dom";
import styles from "../styling/StrakNav.module.css";
import { UserContext } from "../context/User";
import { useContext } from "react";

export default function StrakNav() {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    setUser(false);
  };
  return (
    <nav className={styles.nav}>
      <Link to="/strak/leaderboard" className={styles.navLink}>
        Leader Board
      </Link>
      {user ? (
        <>
          <Link to="/strak/scores" className={styles.navLink}>
            Enter Scores
          </Link>
        </>
      ) : (
        <></>
      )}
      <Link to="/strak/history" className={styles.navLink}>
        Previous Scores
      </Link>
      <Link to="/strak/players" className={styles.navLink}>
        Player List
      </Link>
      {user ? (
        <p
          onClick={handleSignOut}
          className={`${styles.navLink} ${styles.userButton}`}
        >
          {`Hi ${user.name}! Sign out`}
        </p>
      ) : (
        <>
          <Link to="/strak/login" className={styles.navLink}>
            Log In
          </Link>
        </>
      )}
    </nav>
  );
}
