export const findNewPlayerID = (playerList) => {
  let highestId = 0;

  playerList.forEach((player) => {
    if (player.playerID > highestId) {
      highestId = player.playerID;
    }
  });

  return highestId + 1;
};

export const addPositionText = (pos) => {
  let position = pos.toString();
  if (position.endsWith(1) && pos !== 11) {
    return position + "st";
  }
  if (position.endsWith(2) && pos !== 12) {
    return position + "nd";
  }
  if (position.endsWith(3) && pos !== 13) {
    return position + "rd";
  }
  return position + "th";
};

export const sortArrayByObjectElement = (array, key) => {
  const sortedArray = array.sort(({ [key]: a }, { [key]: b }) => b - a);
  return sortedArray;
};

export const sumArrayElements = (array) => {
  let sum = 0;
  array.forEach((element) => {
    sum += element.score;
  });
  return sum;
};

export const findTodaysDate = () => {
  const today = new Date().toLocaleDateString();
  return today;
};
