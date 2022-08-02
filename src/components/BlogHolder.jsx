import styles from '../styling/BlogHolder.module.css';
import portrait from '../images/bw_portrait.jpg';
import famSki from '../images/fam-ski.jpg';
import BlogParagraph from './BlogParagraph';

export default function BlogHolder() {
  return (
    <section className={styles.section}>
      <h2>About me...</h2>
      <img src={portrait} alt="protrait" className={styles.portrait} />
      <BlogParagraph />
      <img src={famSki} alt="skiing in the Alps" className={styles.famSki} />
    </section>
  );
}
