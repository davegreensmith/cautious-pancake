import { useEffect } from "react";
import { fetchScores } from "../firebase/scores";
import StrakHeader from "./StrakHeader";
import StrakNav from "./StrakNav";

export default function StrakPlayers() {
  useEffect(() => {
    fetchScores().then((scoresList) => {
      console.log(scoresList);
    });
  }, []);

  return (
    <section className="strak-app-container">
      <StrakHeader />
      <StrakNav />
      <h3 className="strak-subheader">History</h3>
    </section>
  );
}
