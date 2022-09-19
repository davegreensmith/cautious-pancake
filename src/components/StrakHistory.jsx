import React from "react";
import { useEffect, useState } from "react";

import {
  fetchAllPlayersAndInfo,
  fetchRoundResultsByRoundID,
} from "../firebase/scores";

import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import StrakEditRound from "./StrakEditRound";

import styles from "../styling/StrakHistory.module.css";
import StrakLoadingSpinner from "./StrakLoadingSpinner";

export default function StrakHistory() {
  const [displayPlayers, setDisplayPlayers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editRound, setEditRound] = useState(false);

  const handleEditRound = (roundID) => {
    setIsLoading(true);
    fetchRoundResultsByRoundID(roundID).then((roundScores) => {
      setEditRound(roundScores);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchAllPlayersAndInfo().then((players) => {
      setDisplayPlayers(players);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      {editRound ? (
        <StrakEditRound editRound={editRound} setEditRound={setEditRound} />
      ) : (
        <div>
          <StrakNav />
          {isLoading ? (
            <div>
              <p>Loading history...</p>
              <StrakLoadingSpinner />
            </div>
          ) : (
            <div className={styles.historyResults}>
              <h3 className="strak-subheader">History</h3>
              <div className={styles.historyHeading}>
                <p className={`${styles.headingPlayerLabel}`}>Player</p>
                {displayPlayers[0].roundScores.map((round) => {
                  return (
                    <div key={round.roundID}>
                      <p className={`${styles.headingRoundScoreLabel}`}>
                        {round.roundRef}
                      </p>
                      <button
                        onClick={() => {
                          handleEditRound(round.roundID);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  );
                })}
                <p className={`${styles.headingTotalStabsLabel}`}>TotStabs</p>
              </div>
              {displayPlayers.map((player) => {
                return (
                  <article key={player.id} className={styles.historyCard}>
                    <p className={styles.playerName}>
                      {player.player.playerName}
                    </p>
                    {player.roundScores.map((score, index) => {
                      return (
                        <p
                          key={player.roundScores.roundID}
                          className={styles.roundScore}
                        >
                          {score.score}
                        </p>
                      );
                    })}
                    <p className={styles.totalPoints}>{player.totalStabs}</p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
