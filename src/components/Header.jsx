import logo from '../images/logo.png';
import styles from '../styling/Header.module.css';

export default function Header() {
  return (
    <section className={styles.section}>
      <img src={logo} alt="logo" className={styles.logo} />
      <h2>Greensmith online</h2>
    </section>
  );
}
