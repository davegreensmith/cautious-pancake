import React from "react";
import { useEffect, useState, useContext } from "react";
import { RefreshContext } from "../context/Refresh";

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
  const { refresh, setRefresh } = useContext(RefreshContext);

  const [displayPlayers, setDisplayPlayers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRound, setCurrentRound] = useState(false);
  const [error, setError] = useState(false);

  const handleEditRound = (roundID) => {
    setIsLoading(true);
    fetchRoundResultsByRoundID(roundID).then((roundScores) => {
      setCurrentRound(roundScores);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setError(false);
    fetchAllPlayersAndInfo().then((players) => {
      if (players.length === 0) {
        setError({ msg: "No scores in the database, yet!" });
        setIsLoading(false);
      } else {
        setDisplayPlayers(players);
        setIsLoading(false);
      }
    });
  }, [refresh]);

  if (error) {
    return (
      <section className="strak-app-container">
        {console.log(error)}
        <StrakHeader />
        <StrakNav />
        <h3 className="strak-subheader">History</h3>
        <p className={styles.historyResults}>{error.msg}</p>
      </section>
    );
  } else {
    return (
      <section className="strak-app-container">
        <StrakHeader />
        {currentRound ? (
          <StrakEditRound
            currentRound={currentRound}
            setCurrentRound={setCurrentRound}
          />
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
}
