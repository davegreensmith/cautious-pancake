export default function SkillsCard({ skill: { skill, badge_url }, styles }) {
  return (
    <section className={styles.skillsCard}>
      <h3>{skill}</h3>
    </section>
  );
}
