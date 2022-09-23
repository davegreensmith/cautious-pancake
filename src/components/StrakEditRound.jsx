import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";
import { useContext } from "react";

import {
  deleteScoresByRoundID,
  fetchRoundResultsByRoundID,
  updateScoresByScoreID,
  insertScores,
} from "../firebase/scores";
import {
  fetchLeaders,
  updateLeaderBoardWithPointsByPlayerName,
} from "../firebase/leaderBoard";

import { addPositionText, checkForDuplicateNames } from "../utils.js/functions";

import styles from "../styling/StrakEditRound.module.css";

export default function StrakEditRound({ currentRound, setCurrentRound }) {
  const { user, setUser } = useContext(UserContext);
  let roundRef = "";
  let position = 0;

  for (let key in currentRound.scores) {
    if (key !== "score") {
      roundRef = key;
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  const [formPlayerList, setFormPlayerList] = useState([]);
  const [playerNameArray, setPlayerNameArray] = useState([]);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleBackToRounds = () => {
    setCurrentRound(false);
  };

  const handleNameChange = (position, newName) => {
    const newFormList = [...formPlayerList];
    newFormList[position - 1].playerName = newName;
    if (checkForDuplicateNames(newFormList)) {
      setError({ msg: "Duplicate names detected" });
    } else {
      setError(false);
    }
    setFormPlayerList(newFormList);
  };

  const handleScoreChange = (position, newScore) => {
    const newFormList = [...formPlayerList];
    newFormList[position - 1].score = +newScore;
    setFormPlayerList(newFormList);
  };

  const removeLeaderPoints = (roundScores) => {
    return Promise.all([
      roundScores.map((player) => {
        const leaderBoardScore = +(player.leaderBoardScore * -1);
        const playerName = player.playerName;
        return updateLeaderBoardWithPointsByPlayerName(
          leaderBoardScore,
          playerName
        );
      }),
    ]).then(([promises]) => {
      return promises;
    });
  };

  const addLeaderPoints = (updateLeadersArray) => {
    return Promise.all([
      updateLeadersArray.map((player) => {
        return updateLeaderBoardWithPointsByPlayerName(
          player.totalPoints,
          player.playerName
        );
      }),
    ]);
  };

  const buildUpdatedLeadersArray = () => {
    const updatedLeadersArray = [];
    return fetchLeaders().then((leadersList) => {
      const roundID = currentRound.roundID;
      return fetchRoundResultsByRoundID(roundID).then((roundScores) => {
        const existingRoundInDB = roundScores.scores[roundRef];
        existingRoundInDB.forEach((player) => {
          const searchFor = player.playerName;
          formPlayerList.forEach((formPlayer) => {
            if (formPlayer.playerName === searchFor) {
              const pointsDifference =
                formPlayer.leaderBoardScore - player.leaderBoardScore;
              updatedLeadersArray.push({
                playerName: searchFor,
                totalPoints: pointsDifference,
              });
            }
          });
        });
        return updatedLeadersArray;
      });
    });
  };

  const newScores = (newRound) => {
    const roundID = currentRound.roundID;
    const addScoreBody = { [roundRef]: newRound };
    updateScoresByScoreID(roundID, addScoreBody);
  };

  const handleUpdateScores = (e) => {
    e.preventDefault();
    if (checkForDuplicateNames(formPlayerList)) {
      setError({ msg: "Duplicate names detected" });
    } else {
      buildUpdatedLeadersArray().then((updatedLeadersArray) => {
        return Promise.all([
          updatedLeadersArray.map((player) => {
            return updateLeaderBoardWithPointsByPlayerName(
              player.totalPoints,
              player.playerName
            );
          }),
        ]).then(([promises]) => {
          newScores(formPlayerList);
          navigate("/strak/leaderboard", { replace: true });
        });
      });
    }
  };

  const handleDeleteRound = (e) => {
    e.preventDefault();

    const roundID = currentRound.roundID;

    return fetchRoundResultsByRoundID(roundID).then((roundScores) => {
      const existingRoundInDB = roundScores.scores[roundRef];
      return removeLeaderPoints(existingRoundInDB).then(([promises]) => {
        deleteScoresByRoundID(roundID);
        navigate("/strak/leaderboard", { replace: true });
      });
    });
  };

  useEffect(() => {
    const playersList = currentRound.scores[roundRef];
    const players = [];
    playersList.forEach((player) => {
      players.push(player.playerName);
    });
    setPlayerNameArray([...players]);
    setIsLoading(false);
    const copyOfOriginalRound = [...currentRound.scores[roundRef]];
    setFormPlayerList([...playersList]);
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
                    name={position}
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
                    name={position}
                    onChange={(e) => {
                      handleScoreChange(e.target.name, e.target.value);
                    }}
                  ></input>
                </article>
              );
            })}
            {error ? <p className="errorMsg">{error.msg}</p> : <></>}
            <div className={styles.buttonContainer}>
              <button className="strak-button" onClick={handleUpdateScores}>
                Update scores
              </button>
              <button className="strak-button" onClick={handleBackToRounds}>
                Back to rounds
              </button>
              <button
                className="strak-button strak-button__delete"
                onClick={handleDeleteRound}
              >
                Delete Round
              </button>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
