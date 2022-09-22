import React, { useState } from "react";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import StrakLoadingSpinner from "./StrakLoadingSpinner";

import { useEffect } from "react";
import { addPositionText } from "../utils.js/functions";

import styles from "../styling/StrakScores.module.css";
import { findNextRoundRef, insertScores } from "../firebase/scores";
import { fetchPlayers } from "../firebase/players";

import { updateLeaderBoardWithPointsByPlayerName } from "../firebase/leaderBoard";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { RefreshContext } from "../context/Refresh";

export default function StrakPlayers() {
  const { refresh, setRefresh } = useContext(RefreshContext);

  const [roundRef, setRoundRef] = useState(false);
  const [error, setError] = useState(false);
  const [playerList, setPlayerList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [playerNameArray, setPlayerNameArray] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formPlayerList, setFormPlayerList] = useState([]);

  const navigate = useNavigate();

  let position = 0;

  const handleNameChange = (position, newName) => {
    const newFormList = [...formPlayerList];
    newFormList[position - 1].playerName = newName;
    setFormPlayerList(newFormList);
  };

  const handleScoreChange = (position, newScore) => {
    const newFormList = [...formPlayerList];
    newFormList[position - 1].score = +newScore;
    setFormPlayerList(newFormList);
  };

  const handleSubmitScores = (e) => {
    setButtonDisabled(true);
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    let tempError = false;

    for (let i = 1; i < numberOfPlayers * 2; i = i + 2) {
      if (e.target[i].value === "-select-" || e.target[i + 1].value === "") {
        setError({ msg: "Missing information, please check and try again" });
        tempError = true;
      }
    }

    if (error || tempError) {
      console.log("ERROR!");
    } else {
      const scoresBody = [];
      const updateLeadersArray = [];

      for (let i = 1; i < numberOfPlayers * 2; i += 2) {
        const leaderBoardScore = numberOfPlayers + 1 - (i + 1) / 2;
        const scoresObj = {
          playerName: e.target[i].value,
          position: (i + 1) / 2,
          score: +e.target[i + 1].value,
          leaderBoardScore,
        };
        const leadersObj = {
          playerName: e.target[i].value,
          totalPoints: leaderBoardScore,
        };

        scoresBody.push(scoresObj);
        updateLeadersArray.push(leadersObj);
      }
      if (scoresBody.length === 0) {
        setError({ msg: "Something went wrong, please try again" });
      } else {
        const bodyKey = e.target[0].value;
        const addScoreBody = { [bodyKey]: scoresBody };
        insertScores(addScoreBody);
        updateLeadersArray.forEach((player) => {
          updateLeaderBoardWithPointsByPlayerName(
            player.totalPoints,
            player.playerName
          );
        });
        console.log(refresh, "<<< refresh");
        const toggle = !refresh;
        console.log(toggle, "<<< toggled");
        setRefresh(toggle);
        navigate("/strak/leaderboard");
      }
    }

    setButtonDisabled(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    findNextRoundRef().then((nextRoundDeets) => {
      setRoundRef(nextRoundDeets);
    });
    fetchPlayers()
      .then((playersList) => {
        setPlayerList(playersList);
        const players = ["-select-"];
        playersList.forEach((player) => {
          players.push(player.playerName);
        });
        setPlayerNameArray(players);
        const playerCount = playersList.length;
        setNumberOfPlayers(playerCount);
        setIsLoading(false);
      })
      .then(() => {});
  }, [refresh]);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      {isSubmitting ? (
        <div>
          <p>Sending scores...</p>
          <StrakLoadingSpinner />
        </div>
      ) : (
        <div>
          <h3 className="strak-subheader">Input stableford round scores</h3>
          {isLoading ? (
            <div>
              <p>Loading information...</p>
              <StrakLoadingSpinner />
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmitScores} className={styles.form}>
                <div className={styles.roundInfo}>
                  <label htmlFor="roundInfo">Round reference </label>
                  <input
                    type="text"
                    id="roundInfo"
                    value={roundRef}
                    readOnly
                    className={styles.roundRef}
                  ></input>
                </div>
                {playerList.map((player) => {
                  position++;
                  return (
                    <article key={position} className={styles.scoreCard}>
                      <label className={styles.positionLabel}>
                        {addPositionText(position)}{" "}
                      </label>
                      <select
                        name="player"
                        id="player"
                        className={styles.selecterBox}
                      >
                        {playerNameArray.map((player, index) => {
                          return (
                            <option
                              value={player}
                              key={index * position + 100}
                              onChange={(e) => {}}
                            >
                              {player}
                            </option>
                          );
                        })}
                      </select>
                      <input
                        type="number"
                        className={styles.stablefordInput}
                      ></input>
                    </article>
                  );
                })}
                {error ? <p className={styles.errorMsg}>{error.msg}</p> : <></>}
                <button className="strak-button" disabled={buttonDisabled}>
                  Submit scores
                </button>
                <button
                  type="reset"
                  className="strak-button"
                  disabled={buttonDisabled}
                >
                  Reset
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
