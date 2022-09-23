import React from "react";
import { useEffect } from "react";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";
import { UserContext } from "../context/User";
import { useContext } from "react";

export default function StrakLogin() {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {}, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      <h3 className="strak-subheader">User login</h3>
    </section>
  );
}
