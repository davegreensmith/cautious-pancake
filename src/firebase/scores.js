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
  addDoc(collection(db, "scores"), body)
    .then((data) => {})
    .catch((err) => {
      console.log(err, "<<< insertScores ERROR");
    });
}

export function fetchScoresByPlayerName(playerName) {
  return fetchScores().then((scoresList) => {
    const roundScores = [];
    let roundRef = "";
    scoresList.forEach((round) => {
      for (let key in round) {
        if (key !== "id") {
          roundRef = key;
          const roundResult = round[key];
          for (let i = 0; i < roundResult.length; i++) {
            if (roundResult[i].playerName === playerName) {
              roundScores.push(roundResult[i].score);
            }
          }
        }
      }
    });
    return roundScores;
  });
}
