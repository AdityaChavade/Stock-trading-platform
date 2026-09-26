import Navbar from "../Navbar";
import Watchlistitem from "../WatchlistSidebar/WatchlistItem";
import Dashboard from "./Dashboard";
import { Outlet } from "react-router-dom";
import { useState } from "react";

import "./maincontent.css";
import { GeneralContext } from "../WatchlistSidebar/GeneralContext";
import { AccountProvider } from "../context/accountcontext";

function MainContent() {
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  return (
    <AccountProvider>
      <div className="maincontent">
        <div className={`left ${isWatchlistOpen ? "open" : ""}`}>
          <GeneralContext>
            <Watchlistitem/>
          </GeneralContext>
        </div>
        <div className="right">
          <Navbar 
            toggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)} 
            isWatchlistOpen={isWatchlistOpen} 
          />

          <Outlet />
          <br></br>
          <br></br> {/* Extra space for bottom nav */}
        </div>
      </div>
    </AccountProvider>
  );
}

export default MainContent;
