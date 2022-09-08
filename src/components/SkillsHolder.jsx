import React from "react";
import styles from "../styling/SkillsHolder.module.css";
import SkillsCard from "./SkillsCard";
import { skills } from "../data/skills";

export default function SkillsHolder() {
  return (
    <section className={styles.section}>
      <h2>Technical skills...</h2>
      {skills.map((skill) => {
        return (
          <SkillsCard key={skill.skill_id} skill={skill} styles={styles} />
        );
      })}
    </section>
  );
}
