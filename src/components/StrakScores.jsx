import { useState } from "react";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";

import useGetPlayers from "../hooks/useGetPlayers";
import { useEffect } from "react";
import { addPositionText } from "../utils.js/functions";

import styles from "../styling/StrakScores.module.css";
import { insertScores } from "../firebase/scores";
import { updateLeaderBoardWithPointsByPlayerName } from "../firebase/leaderBoard";

export default function StrakPlayers() {
  const [roundNo, setRoundNo] = useState(false);
  const [error, setError] = useState(false);

  const [player1Name, setPlayer1Name] = useState({
    name: "-select",
    score: "",
  });

  let position = 0;
  const {
    playerList,
    setPlayerList,
    isLoading,
    setIsLoading,
    numberOfPlayers,
    playerNameArray,
  } = useGetPlayers();

  const handleScoreInput = (e) => {
    e.preventDefault();
    for (let i = 1; i < numberOfPlayers * 2; i = i + 2) {
      if (e.target[i].value === "-select-" || e.target[i + 1].value === "") {
        setError({ msg: "Missing information, please check and try again" });
      }
    }
    if (error) {
    } else {
      console.log(e, "<<< e");
      const scoresBody = [];
      const updateLeadersArray = [];
      for (let i = 1; i < numberOfPlayers * 2; i = i + 2) {
        console.log(e.target[i]);
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
        console.log(scoresObj, "<<< scores object");
        console.log(leadersObj, "<<< leaders object");

        scoresBody.push(scoresObj);
        updateLeadersArray.push(leadersObj);
      }
      const bodyKey = e.target[0].value;
      const addScoreBody = { [bodyKey]: scoresBody };
      insertScores(addScoreBody);
      updateLeadersArray.forEach((player) => {
        updateLeaderBoardWithPointsByPlayerName(
          player.totalPoints,
          player.playerName
        );
      });
    }
  };

  useEffect(() => {}, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      <h3 className="strak-subheader">Input stableford round scores</h3>
      {isLoading ? (
        <p>Loading information...</p>
      ) : (
        <div>
          <form onSubmit={handleScoreInput} className={styles.form}>
            <div className={styles.roundInfo}>
              <label htmlFor="roundInfo">Round reference </label>
              <input type="text" id="roundInfo"></input>
            </div>
            {playerList.map((player) => {
              position++;
              return (
                <article key={player.playerID} className={styles.scoreCard}>
                  <label className={styles.positionLabel}>
                    {addPositionText(position)}{" "}
                  </label>
                  <select
                    name="player"
                    id="player"
                    className={styles.selecterBox}
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                  >
                    {playerNameArray.map((player, index) => {
                      return (
                        <option value={player} key={index}>
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
            <button className="strak-button">Submit scores</button>
            <button type="reset" className="strak-button">
              Reset
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
