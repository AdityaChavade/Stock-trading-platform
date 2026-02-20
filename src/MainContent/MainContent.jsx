import Navbar from "../Navbar";
import SearchBar from "../WatchlistSidebar/SearchBar";
import Watchlistitem from "../WatchlistSidebar/WatchlistItem";
import Commodity from "./Commodity";
import Dashboard from "./Dashboard";
import Equity from "./Equity";
import Holding from "./Holding";
import HoldingBarGraph from "./HoldingBarGraph";
import Portfolio from "./Portfolio";
import { Outlet } from "react-router-dom";

import "./maincontent.css";

function MainContent() {
  return (
    <div className="maincontent">
      <div className="left">
        <Watchlistitem />
      </div>

      <div className="right">
        <Navbar></Navbar>
        <Outlet />

        <br></br>
      </div>
    </div>
  );
}

export default MainContent;
