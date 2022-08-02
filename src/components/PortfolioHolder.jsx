import { portfolio } from '../data/portfolio';
import PortfolioCard from '../components/PortfolioCard.jsx';
import styles from '../styling/PortfolioHolder.module.css';

export default function PortfolioHolder() {
  return (
    <section className={styles.section}>
      <h2>Portfolio...</h2>
      {portfolio.map((project) => {
        return <PortfolioCard key={project.portfolio_id} project={project} styles={styles} />;
      })}
    </section>
  );
}
