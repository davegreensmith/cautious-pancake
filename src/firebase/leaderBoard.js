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
  return fetchLeaders().then((leadersList) => {
    leadersList.forEach((leaderPlayer) => {
      if (leaderPlayer.playerName === playerName) {
        leaderPlayer.totalPoints += points;
        const newBody = {
          totalPoints: leaderPlayer.totalPoints,
          playerName: leaderPlayer.playerName,
          playerID: leaderPlayer.playerID,
        };
        const leaderRef = doc(db, "leaderBoard", leaderPlayer.id);
        return setDoc(leaderRef, newBody);
      }
    });
  });
}

export function createLeaderBoardEntryByPlayerName(body) {
  return addDoc(leadersRef, body);
}
