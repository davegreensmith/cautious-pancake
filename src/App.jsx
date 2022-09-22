import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import BlogHolder from "./components/BlogHolder";
import SkillsHolder from "./components/SkillsHolder";
import PortfolioHolder from "./components/PortfolioHolder";
import LinksHolder from "./components/LinksHolder";
import GotLost from "./components/GotLost";
import StrakHistory from "./components/StrakHistory";
import StrakLeaderBoard from "./components/StrakLeaderboard";
import StrakPlayers from "./components/StrakPlayers";
import StrakScores from "./components/StrakScores";
import "./App.css";
import { useState } from "react";
import { RefreshContext } from "./context/Refresh";

function App() {
  const [refresh, setRefresh] = useState(false);
  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      <BrowserRouter>
        <div className="App">
          <Header />
          <NavBar />
          <div className="portal">
            <Routes>
              <Route path="/" element={<BlogHolder />}></Route>
              <Route path="/skills" element={<SkillsHolder />}></Route>
              <Route path="/portfolio" element={<PortfolioHolder />}></Route>
              <Route path="/links" element={<LinksHolder />}></Route>
              <Route
                path="/strak/leaderboard"
                element={<StrakLeaderBoard />}
              ></Route>
              <Route path="/strak/scores" element={<StrakScores />}></Route>
              <Route path="/strak/history" element={<StrakHistory />}></Route>
              <Route path="/strak/players" element={<StrakPlayers />}></Route>
              <Route path="*" element={<GotLost />}></Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </RefreshContext.Provider>
  );
}

export default App;
