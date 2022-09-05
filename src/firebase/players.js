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

export const db = getFirestore();

const playersRef = collection(db, "players");

export function fetchPlayers() {
  return getDocs(playersRef)
    .then((snapshot) => {
      let playersList = [];
      snapshot.docs.forEach((doc) => {
        playersList.push({ ...doc.data(), id: doc.id });
      });
      return playersList;
    })
    .catch((err) => {});
}

export function deletePlayerByDocID(docID) {
  deleteDoc(doc(db, "players", docID)).catch((err) => {
    console.log(err, "<<< Error");
  });
}

export function addPlayerToList(body) {
  addDoc(collection(db, "players"), body)
    .then((data) => {})
    .catch((err) => {
      console.log(err, "<<< Error");
    });
}
