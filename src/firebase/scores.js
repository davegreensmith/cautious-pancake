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

import { fetchLeaders } from "./leaderBoard";
import {
  findTodaysDate,
  sortArrayByObjectElement,
  sumArrayElements,
} from "../utils.js/functions";

const scoresRef = collection(db, "scores");

export function fetchScores() {
  return getDocs(scoresRef)
    .then((snapshot) => {
      let scoresList = [];
      snapshot.docs.forEach((doc) => {
        scoresList.push({ ...doc.data(), id: doc.id });
      });
      return scoresList;
    })
    .catch((err) => {});
}

export function insertScores(body) {
  console.log(body, "<<< body in insertScores");
  addDoc(collection(db, "scores"), body);
}

export function fetchScoresByPlayerName(playerName) {
  return fetchScores()
    .then((scoresList) => {
      const roundScores = [];
      let roundRef = "";
      scoresList.forEach((round) => {
        for (let key in round) {
          if (key !== "id") {
            roundRef = key;
            const roundResult = round[key];
            for (let i = 0; i < roundResult.length; i++) {
              if (roundResult[i].playerName === playerName) {
                roundScores.push({ roundRef, score: roundResult[i].score });
              }
            }
          }
        }
      });
      return roundScores;
    })
    .catch((err) => {
      console.log(err, "<<< Error");
    });
}
export function fetchAllPlayersAndInfo() {
  return fetchLeaders().then((leadersList) => {
    const sortedArray = sortArrayByObjectElement(leadersList, "totalPoints");
    const players = sortedArray.map((player) => {
      return fetchScoresByPlayerName(player.playerName).then((roundScores) => {
        const totalStabs = sumArrayElements(roundScores);
        return { player, roundScores, totalStabs };
      });
    });
    return Promise.all(players).then((resolvedPromises) => {
      return resolvedPromises;
    });
  });
}

export function findNextRoundRef() {
  return fetchScores().then((scoresList) => {
    const nextRoundNo = scoresList.length + 1;
    const today = findTodaysDate();
    return `r${nextRoundNo}_${today}`;
  });
}
