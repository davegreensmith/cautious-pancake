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

const db = getFirestore();

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
  deleteDoc(doc(db, "players", docID));
}

export function addPlayerToList(body) {
  addDoc(collection(db, "players"), body).then((data) => {});
}
