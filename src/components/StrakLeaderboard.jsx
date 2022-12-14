import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { fetchLeaderBoardInfo, fetchLeaders } from "../firebase/leaderBoard";
import { sortArrayByObjectElement } from "../utils.js/functions";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import StrakLoadingSpinner from "./StrakLoadingSpinner";
import { addPositionText } from "../utils.js/functions";
import styles from "../styling/StrakLeader.module.css";
import {
  fetchAllPlayersAndInfo,
  fetchScores,
  fetchScoresByPlayerName,
} from "../firebase/scores";
import { useContext } from "react";
import { RefreshContext } from "../context/Refresh";
import { UserContext } from "../context/User";

export default function StrakLeaders() {
  const { user, setUser } = useContext(UserContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const [sortedLeadersArray, setSortedLeadersArray] = useState(false);
  const [noOfPlayers, setNoOfPlayers] = useState();

  let position = 0;

  useEffect(() => {
    fetchLeaderBoardInfo().then((leadersList) => {
      setSortedLeadersArray(
        sortArrayByObjectElement(leadersList, "totalPoints")
      );
    });
    // fetchLeaderBoardInfo().then((data) => {
    //   console.log(data, "<<< data");
    // });
    // fetchScores().then((scoresList) => {});
  }, [refresh]);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      <h3 className="strak-subheader">Leader Board</h3>

      {sortedLeadersArray ? (
        <article className={styles.leaderCardHolder}>
          <div className={styles.leaderCard}>
            <p className={styles.leaderCardPos}>Pos</p>
            <p className={styles.leaderCardPlyr}>Player</p>
            <p className={styles.leaderCardLBPts}>LB pts</p>
            <p className={styles.leaderCardDiff}>Diff.</p>
            <p className={styles.leaderCardDiff}>Stabs</p>
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
                <p className={styles.leaderCardDiff}>
                  {(sortedLeadersArray[0].totalPoints - player.totalPoints) *
                    -1}
                </p>
                <p className={styles.leaderCardLBPts}>{player.totalStabs}</p>
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
