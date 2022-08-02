export default function PortfolioCard({ project: { name, link_url, description }, styles }) {
  return (
    <article className={styles.portfolioCard}>
      <h3>{name}</h3>
      <a href={link_url} target="_blank">
        Hosted project
      </a>
      <p>{description}</p>
    </article>
  );
}
