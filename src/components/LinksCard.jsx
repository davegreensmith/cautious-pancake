export default function LinksCard({ link: { name, link_url }, styles }) {
  return (
    <article className={styles.linksCard}>
      <a href={link_url} target="_blank">
        {name}
      </a>
    </article>
  );
}
