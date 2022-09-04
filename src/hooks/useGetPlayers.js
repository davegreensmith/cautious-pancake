import { useEffect, useState } from "react";
import { fetchPlayers } from "../firebase/players";

const useGetPlayers = () => {
  const [playerList, setPlayerList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [playerNameArray, setPlayerNameArray] = useState([]);

  useEffect(() => {
    fetchPlayers()
      .then((playersList) => {
        setPlayerList(playersList);
        setIsLoading(false);
        const players = ["-select-"];
        playersList.forEach((player) => {
          players.push(player.playerName);
        });
        setPlayerNameArray(players);
      })
      .then(() => {
        const players = playerList.length;
        setNumberOfPlayers(players);
      });
  }, []);

  return {
    playerList,
    setPlayerList,
    isLoading,
    setIsLoading,
    numberOfPlayers,
    playerNameArray,
  };
};

export default useGetPlayers;
