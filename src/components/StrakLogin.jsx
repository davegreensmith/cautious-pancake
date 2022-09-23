import React, { useEffect, useContext, useState } from "react";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import { UserContext } from "../context/User";
import styles from "../styling/StrakLogin.module.css";
import { fetchUserDetails, signInUser } from "../firebase/user";
import { useNavigate } from "react-router-dom";

export default function StrakLogin() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [loginFormDetails, setLoginFormDetails] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);

  const handleEmailChange = (e) => {
    setError(false);
    const newFormDetails = { ...loginFormDetails };
    newFormDetails.email = e.target.value;
    setLoginFormDetails(newFormDetails);
  };
  const handlePasswordChange = (e) => {
    setError(false);
    const newFormDetails = { ...loginFormDetails };
    newFormDetails.password = e.target.value;
    setLoginFormDetails(newFormDetails);
  };

  const handleContinueAsGuest = (e) => {
    e.preventDefault();
    console.log("Continue as guest");
    setUser(false);
    navigate("/strak/leaderboard", { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginFormDetails.email === "") {
      setError({ msg: "Enter an email address" });
    } else if (loginFormDetails.password === "") {
      setError({ msg: "Enter a password" });
    } else {
      signInUser(loginFormDetails.email, loginFormDetails.password)
        .then((user) => {
          fetchUserDetails(user.uid).then((userData) => {
            setUser(userData);
            navigate("/strak/leaderboard", { replace: true });
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/wrong-password") {
            console.log(
              errorCode,
              "<<< error code",
              errorMessage,
              "<<< error message"
            );
            setError({ msg: "Wrong password" });
          } else if (errorCode === "auth/user-not-found") {
            console.log(
              errorCode,
              "<<< error code",
              errorMessage,
              "<<< error message"
            );
            setError({ msg: "Email not found" });
          } else if (errorCode === "auth/internal-error") {
            console.log(
              errorCode,
              "<<< error code",
              errorMessage,
              "<<< error message"
            );
            setError({ msg: "Incorrect email and password" });
          } else {
            console.log(
              "Unhandled Error!",
              errorCode,
              "<<< error code",
              errorMessage,
              "<<< error message"
            );
          }
        });
    }
  };

  useEffect(() => {}, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      <h3 className="strak-subheader">User login</h3>
      <section>
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.form}>
            <label htmlFor="email">email </label>
            <input
              className={styles.inputBox}
              type="text"
              id="email"
              value={loginFormDetails.email}
              onChange={handleEmailChange}
            />
            <label htmlFor="password">password </label>
            <input
              className={styles.inputBox}
              type="password"
              id="password"
              value={loginFormDetails.password}
              onChange={handlePasswordChange}
            />
            <legend>Enter log in credentials</legend>
            {error ? <p>{error.msg}</p> : <></>}
            <button className="strak-button" type="submit">
              Submit
            </button>
            <button className="strak-button" onClick={handleContinueAsGuest}>
              Continue as guest
            </button>
          </fieldset>
        </form>
      </section>
    </section>
  );
}
