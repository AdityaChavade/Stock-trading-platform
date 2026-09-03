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
  import { GeneralContext } from "../WatchlistSidebar/GeneralContext";

  function MainContent() {
    return (
      <div className="maincontent">
        <div className="left">
          <GeneralContext>
            <Watchlistitem/>
          </GeneralContext>
        </div>
        <div className="right">
          <Navbar></Navbar>
          <div><h1>hello</h1></div>
          <Outlet />
          <br></br>
        </div>
      </div>
    );
  }

  export default MainContent;
