import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./players.js";

const auth = getAuth();

export const signInUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      // Signed in
      const user = userCredential.user;
      return user;
      // ...
    }
  );
};

export const fetchUserDetails = (uid) => {
  const userRef = doc(db, "users", uid);
  return getDoc(userRef).then((snapshot) => {
    return snapshot.data();
  });
};
