import React from "react";

export default function PortfolioCard({
  project: { name, link_url, description, github },
  styles,
}) {
  return (
    <article className={styles.portfolioCard}>
      <h3>{name}</h3>
      <div className={styles.linkHolder}>
        {link_url ? (
          <a href={link_url} target="_blank" className={styles.aTags}>
            Hosted project
          </a>
        ) : (
          <></>
        )}
        {github ? (
          <a href={github} target="_blank" className={styles.aTags}>
            Github repo
          </a>
        ) : (
          <></>
        )}
      </div>
      <p>{description}</p>
    </article>
  );
}
