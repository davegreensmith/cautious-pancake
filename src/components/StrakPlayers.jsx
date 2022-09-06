import { useState } from "react";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import { addPlayerToList, deletePlayerByDocID } from "../firebase/players";
import { findNewPlayerID } from "../utils.js/functions";

import styles from "../styling/StrakPlayers.module.css";
import useGetPlayers from "../hooks/useGetPlayers";
import { createLeaderBoardEntryByPlayerName } from "../firebase/leaderBoard";

export default function StrakPlayers() {
  const { playerList, setPlayerList, isLoading } = useGetPlayers();
  const [newName, setNewName] = useState("");

  function handleRemovePlayer(id) {
    console.log(id);
    deletePlayerByDocID(id);
  }

  function handleAddPlayer(e) {
    e.preventDefault();
    const newID = findNewPlayerID(playerList);
    const addNameBody = { playerID: newID, playerName: newName };
    addPlayerToList(addNameBody);
    const addLeaderBoardBody = { ...addNameBody, totalPoints: 0 };
    createLeaderBoardEntryByPlayerName(addLeaderBoardBody);

    const updatePlayerList = [...playerList];
    updatePlayerList.push(addNameBody);
    setPlayerList(updatePlayerList);

    setNewName("");
  }

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      {isLoading ? (
        <p>loading players list...</p>
      ) : (
        <div>
          <h3 className="strak-subheader">Players List</h3>
          <div className={styles.playersContainer}>
            {playerList.map((player) => {
              return (
                <article className={styles.article} key={player.playerID}>
                  {player.playerName}
                  {/* <button
                  className="strak-button"
                  onClick={() => {
                    handleRemovePlayer(player.id);
                  }}
                  >
                  Remove
                </button> */}
                </article>
              );
            })}
          </div>
        </div>
      )}
      {/* <form onSubmit={handleAddPlayer} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <label htmlFor="newName">Name: </label>
          <input
            id="newName"
            name="newName"
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
          <button className="strak-button">Submit</button>
          <legend>Add a player to the list</legend>
        </fieldset>
      </form> */}
    </section>
  );
}
