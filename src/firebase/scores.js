import { db } from "./players.js";

import app from "./config";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
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

export function fetchRoundResultsByRoundID(roundID) {
  const scoreRef = doc(db, "scores", roundID);
  return getDoc(scoreRef)
    .then((snapshot) => {
      const roundScores = { scores: snapshot.data(), roundID: snapshot.id };
      return roundScores;
    })
    .catch((err) => {});
}

export function insertScores(body) {
  addDoc(collection(db, "scores"), body);
}

export function updateScoresByScoreID(scoreID, body) {
  setDoc(doc(db, "scores", scoreID), body);
}

export function deleteScoresByRoundID(roundID) {
  deleteDoc(doc(db, "scores", roundID));
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
                roundScores.push({
                  roundRef,
                  score: roundResult[i].score,
                  roundID: round.id,
                });
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
