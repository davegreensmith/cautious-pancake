import React, { useState, useContext } from "react";
import { UserContext } from "../context/User";
import { useNavigate } from "react-router-dom";

import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";

import { addPlayerToList, deletePlayerByDocID } from "../firebase/players";
import { correctCapitalisation, findNewPlayerID } from "../utils.js/functions";

import useGetPlayers from "../hooks/useGetPlayers";
import { createLeaderBoardEntryByPlayerName } from "../firebase/leaderBoard";
import StrakLoadingSpinner from "./StrakLoadingSpinner";

import styles from "../styling/StrakPlayersManage.module.css";
import { useEffect } from "react";

export default function StrakPlayers() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { playerList, setPlayerList, isLoading } = useGetPlayers();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(false);

  function handleRemovePlayer(id) {
    deletePlayerByDocID(id);
  }

  const handlePlayerList = () => {
    navigate("/strak/players");
  };

  function handleAddPlayer(e) {
    e.preventDefault();
    const correctedNewName = correctCapitalisation(newName);
    let playerExists = false;
    playerList.forEach((player) => {
      if (player.playerName === correctedNewName) {
        playerExists = true;
      }
    });
    if (playerExists) {
      setError({ msg: `Player ${correctedNewName} already exists!` });
    } else {
      console.log(`${correctedNewName} That's a new player!`);

      const newID = findNewPlayerID(playerList);
      const addNameBody = { playerID: newID, playerName: correctedNewName };
      addPlayerToList(addNameBody);
      const addLeaderBoardBody = { ...addNameBody, totalPoints: 0 };
      createLeaderBoardEntryByPlayerName(addLeaderBoardBody);

      const updatePlayerList = [...playerList];
      updatePlayerList.push(addNameBody);
      setPlayerList(updatePlayerList);

      setNewName("");
    }
  }

  useEffect(() => {
    if (user) {
    } else {
      navigate("/strak/players");
    }
  }, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      {isLoading ? (
        <div>
          <p>loading players list...</p>
          <StrakLoadingSpinner />
        </div>
      ) : (
        <div>
          <h3 className="strak-subheader">Players List</h3>
          <div className={styles.playersContainer}>
            {playerList.map((player) => {
              return (
                <article className={styles.article} key={player.playerID}>
                  {player.playerName}
                  <button
                    className="strak-button"
                    onClick={() => {
                      handleRemovePlayer(player.id);
                    }}
                  >
                    Remove
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      )}
      <form onSubmit={handleAddPlayer} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <label htmlFor="newName">Name: </label>
          <input
            id="newName"
            name="newName"
            type="text"
            value={newName}
            onChange={(e) => {
              setError(false);
              setNewName(e.target.value);
            }}
          />
          {error ? <p className="errorMsg">{error.msg}</p> : <></>}
          <button className="strak-button">Submit</button>
          <legend>Add a player to the list</legend>
        </fieldset>
      </form>
      {user ? (
        <button className="strak-button" onClick={handlePlayerList}>
          Back to player list
        </button>
      ) : (
        <></>
      )}
    </section>
  );
}
