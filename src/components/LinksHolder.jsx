import { links } from "../data/links.js";
import LinksCard from "./LinksCard.jsx";
import styles from "../styling/LinksHolder.module.css";

export default function LinksHolder() {
  return (
    <section className={styles.section}>
      <h2>Links...</h2>
      {links.map((link) => {
        return <LinksCard key={link.link_id} link={link} styles={styles} />;
      })}
    </section>
  );
}
