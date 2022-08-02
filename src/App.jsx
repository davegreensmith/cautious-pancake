import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import BlogHolder from './components/BlogHolder';
import SkillsHolder from './components/SkillsHolder';
import PortfolioHolder from './components/PortfolioHolder';
import LinksHolder from './components/LinksHolder';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <NavBar />
        <Routes>
          <Route path="/" element={<BlogHolder />}></Route>
          <Route path="/skills" element={<SkillsHolder />}></Route>
          <Route path="/portfolio" element={<PortfolioHolder />}></Route>
          <Route path="/links" element={<LinksHolder />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
