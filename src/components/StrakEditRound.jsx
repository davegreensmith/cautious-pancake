import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlayers } from "../firebase/players";
import {
  fetchRoundResultsByRoundID,
  updateScoresByScoreID,
} from "../firebase/scores";
import { addPositionText } from "../utils.js/functions";

import styles from "../styling/StrakEditRound.module.css";
import { updateLeaderBoardWithPointsByPlayerName } from "../firebase/leaderBoard";

export default function StrakEditRound({ editRound, setEditRound }) {
  let roundRef = "";
  let position = 0;

  for (let key in editRound.scores) {
    if (key !== "score") {
      roundRef = key;
    }
  }
  const roundID = editRound.roundID;
  const roundDeets = new Array(...editRound.scores[roundRef]);

  const [isLoading, setIsLoading] = useState(true);
  const [formPlayerList, setFormPlayerList] = useState([]);
  const [playerNameArray, setPlayerNameArray] = useState([]);

  const navigate = useNavigate();

  const handleBackToRounds = () => {
    setEditRound(false);
  };

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

  const removeLeaderPoints = (originalRound) => {
    const reduceLeadersArray = [];
    originalRound.forEach((player) => {
      const playerName = player.playerName;
      const leaderBoardScore = player.leaderBoardScore * -1;
      const leadersObj = { playerName, reducePoints: leaderBoardScore };
      reduceLeadersArray.push(leadersObj);
    });
    reduceLeadersArray.forEach((player) => {
      updateLeaderBoardWithPointsByPlayerName(
        player.reducePoints,
        player.playerName
      );
    });
  };

  const newScoresAndLeaderboard = (newRound) => {
    const numberOfPlayers = formPlayerList.length;
    const scoresBody = [];
    const updateLeadersArray = [];
    newRound.forEach((player) => {
      const scoresObj = {
        playerName: player.playerName,
        position: player.position,
        score: player.score,
        leaderBoardScore: player.leaderBoardScore,
      };
      const leaderBoardScoreObj = {
        playerName: player.playerName,
        totalPoints: player.leaderBoardScore,
      };
      scoresBody.push(scoresObj);
      updateLeadersArray.push(leaderBoardScoreObj);
    });
    console.log(scoresBody, "<<< scoresBody");
    console.log(updateLeadersArray, "<<< update leaders array");
    const addScoreBody = { [roundRef]: scoresBody };
    console.log(addScoreBody, "<<< add score body");
    console.log(roundID, "<<< roundID");
    updateScoresByScoreID(roundID, addScoreBody);
    updateLeadersArray.forEach((player) => {
      updateLeaderBoardWithPointsByPlayerName(
        player.totalPoints,
        player.playerName
      );
    });
    navigate("/strak/leaderboard");
  };

  const handleUpdateScores = (e) => {
    e.preventDefault();
    fetchRoundResultsByRoundID(roundID).then((roundScores) => {
      console.log(formPlayerList, "<<< formPlayer list");
      console.log(formPlayerList, "<<< new round details");
      // originalRound = [...roundScores]
      console.log(roundID, "<<< round ID");
      removeLeaderPoints(roundScores.scores[roundRef]);
      newScoresAndLeaderboard(formPlayerList);
    });
  };

  useEffect(() => {
    setFormPlayerList([...roundDeets]);
    fetchPlayers().then((playersList) => {
      // setPlayerList(playersList);
      const players = [];
      playersList.forEach((player) => {
        players.push(player.playerName);
      });
      setPlayerNameArray(players);
      setIsLoading(false);
    });
  }, []);

  return (
    <section>
      {isLoading ? (
        <>
          <h1>{roundRef}</h1>
        </>
      ) : (
        <>
          <section>
            <form className={styles.form}>
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
              {formPlayerList.map((score, index) => {
                position++;
                return (
                  <article key={index + 100} className={styles.scoreCard}>
                    <label className={styles.positionLabel}>
                      {addPositionText(position)}{" "}
                    </label>
                    <select
                      name={score.position}
                      id="player"
                      className={styles.selecterBox}
                      value={score.playerName}
                      onChange={(e) => {
                        handleNameChange(e.target.name, e.target.value);
                      }}
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
                      defaultValue={score.score}
                      name={score.position}
                      onChange={(e) => {
                        handleScoreChange(e.target.name, e.target.value);
                      }}
                    ></input>
                  </article>
                );
              })}
              <button className="strak-button" onClick={handleUpdateScores}>
                Update scores
              </button>
              <button className="strak-button" onClick={handleBackToRounds}>
                Back to rounds
              </button>
            </form>
          </section>
        </>
      )}
    </section>
  );
}
