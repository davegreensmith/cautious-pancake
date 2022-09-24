import React from "react";
import { UserContext } from "../context/User";
import { useContext } from "react";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";

import styles from "../styling/StrakPlayers.module.css";
import useGetPlayers from "../hooks/useGetPlayers";
import StrakLoadingSpinner from "./StrakLoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function StrakPlayers() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { playerList, setPlayerList, isLoading } = useGetPlayers();

  const handleManagePlayers = () => {
    navigate("/strak/manage-players");
  };

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
                </article>
              );
            })}
          </div>
        </div>
      )}
      {user ? (
        <button className="strak-button" onClick={handleManagePlayers}>
          Manage players
        </button>
      ) : (
        <></>
      )}
    </section>
  );
}
