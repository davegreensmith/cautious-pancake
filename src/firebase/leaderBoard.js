import { db } from "./players.js";

import app from "./config";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { sortArrayByObjectElement } from "../utils.js/functions.js";
import { fetchScoresByPlayerName } from "./scores.js";
import { sumArrayElements } from "../utils.js/functions.js";

const leadersRef = collection(db, "leaderBoard");

export function fetchLeaders() {
  return getDocs(leadersRef)
    .then((snapshot) => {
      let leadersList = [];
      snapshot.docs.forEach((doc) => {
        leadersList.push({ ...doc.data(), id: doc.id });
      });
      return leadersList;
    })
    .catch((err) => {});
}

export function updateLeaderBoardWithPointsByPlayerName(points, playerName) {
  // console.log(playerName, typeof points);
  return fetchLeaders()
    .then((leadersList) => {
      return Promise.all([
        leadersList.map((leaderPlayer) => {
          if (leaderPlayer.playerName === playerName) {
            // console.log(
            //   `player ${leaderPlayer.playerName} has ${leaderPlayer.totalPoints} points in the database, now adding ${points} to their score`
            // );
            leaderPlayer.totalPoints += points;
            const newBody = {
              totalPoints: leaderPlayer.totalPoints,
              playerName: leaderPlayer.playerName,
              playerID: leaderPlayer.playerID,
            };
            // console.log(newBody, "<<< update body details");
            const leaderRef = doc(db, "leaderBoard", leaderPlayer.id);
            return setDoc(leaderRef, newBody);
          }
        }),
      ]).then(([promises]) => {
        return promises;
        // console.log(promises, "<<< returned promises from update leaders");
      });
    })
    .catch((err) => {
      console.log(err, "<<< Error");
    });
}

export function createLeaderBoardEntryByPlayerName(body) {
  return addDoc(leadersRef, body).catch((err) => {
    console.log(err, "<<< Error");
  });
}

export function fetchLeaderBoardInfo() {
  return fetchLeaders().then((leadersList) => {
    const sortedArray = sortArrayByObjectElement(leadersList, "totalPoints");
    const players = sortedArray.map((player) => {
      return fetchScoresByPlayerName(player.playerName).then((roundScores) => {
        const totalStabs = sumArrayElements(roundScores);
        const leaderBoardInfo = { ...player, totalStabs };
        return leaderBoardInfo;
      });
    });
    return Promise.all(players).then((resolvedPromises) => {
      return resolvedPromises;
    });
  });
}
