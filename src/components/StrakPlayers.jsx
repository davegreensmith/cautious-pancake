import { useEffect } from "react";
import { useState } from "react";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import {
  addPlayerToList,
  deletePlayerByDocID,
  fetchPlayers,
} from "../firebase/players";
import { findNewPlayerID } from "../utils.js/functions";

export default function StrakPlayers() {
  const [playerList, setPlayerList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

    const updatePlayerList = [...playerList];
    updatePlayerList.push(addNameBody);
    setPlayerList(updatePlayerList);

    setNewName("");
  }

  useEffect(() => {
    fetchPlayers().then((playersList) => {
      setPlayerList(playersList);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      {isLoading ? (
        <p>loading players list...</p>
      ) : (
        <div>
          <h3>Players List</h3>
          {playerList.map((player) => {
            return (
              <article key={player.playerID}>
                {player.playerName}
                <button
                  onClick={() => {
                    handleRemovePlayer(player.id);
                  }}
                >
                  remove
                </button>
              </article>
            );
          })}
        </div>
      )}
      <form onSubmit={handleAddPlayer}>
        <fieldset>
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
          <button>submit</button>
          <legend>Add a player to the list</legend>
        </fieldset>
      </form>
    </section>
  );
}
