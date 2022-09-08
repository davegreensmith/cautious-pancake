import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { fetchLeaders } from "../firebase/leaderBoard";
import { sortArrayByObjectElement } from "../utils.js/functions";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import StrakLoadingSpinner from "./StrakLoadingSpinner";
import { addPositionText } from "../utils.js/functions";
import styles from "../styling/StrakLeader.module.css";
import { fetchScores, fetchScoresByPlayerName } from "../firebase/scores";

export default function StrakLeaders() {
  const [sortedLeadersArray, setSortedLeadersArray] = useState(false);
  const [noOfPlayers, setNoOfPlayers] = useState();

  let position = 0;

  useEffect(() => {
    fetchLeaders().then((leadersList) => {
      setSortedLeadersArray(
        sortArrayByObjectElement(leadersList, "totalPoints")
      );
    });
    fetchScores().then((scoresList) => {});
  }, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      <h3 className="strak-subheader">Leader Board</h3>

      {sortedLeadersArray ? (
        <article>
          <div className={styles.leaderCard}>
            <p className={styles.leaderCardPos}>Pos</p>
            <p className={styles.leaderCardPlyr}>Player</p>
            <p className={styles.leaderCardLBPts}>LB pts</p>
          </div>
          {sortedLeadersArray.map((player) => {
            position++;
            return (
              <div className={styles.leaderCard} key={player.id}>
                <p className={styles.leaderCardPos}>
                  {addPositionText(position)}
                </p>
                <p className={styles.leaderCardPlyr}>{player.playerName}</p>
                {/* {fetchScoresByPlayerName(player.playerName).then(
                  (roundScores) => {
                    console.log(roundScores, "<<< round scores");
                    // roundScores.map((round) => {
                    // console.log(round, "<<< round");
                    // return <p>{round.score}</p>;
                    // });
                  }
                )} */}
                <p className={styles.leaderCardLBPts}>{player.totalPoints}</p>
              </div>
            );
          })}
        </article>
      ) : (
        <div>
          <p>Loading leader board...</p>
          <StrakLoadingSpinner />
        </div>
      )}
    </section>
  );
}
