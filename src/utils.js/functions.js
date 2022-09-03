export const findNewPlayerID = (playerList) => {
  let highestId = 0;

  playerList.forEach((player) => {
    if (player.playerID > highestId) {
      highestId = player.playerID;
    }
  });

  return highestId + 1;
};
