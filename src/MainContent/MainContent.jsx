import Navbar from "../Navbar";
import Watchlistitem from "../WatchlistSidebar/WatchlistItem";
import Commodity from "./Commodity";
import Equity from "./Equity";
import Holding from "./Holding";
import HoldingBarGraph from "./HoldingBarGraph";
import Portfolio from "./Portfolio";
import "./maincontent.css";

function MainContent() {
  return (
    <div className="maincontent">
      <div className="left">
        <Watchlistitem />
      </div>

      <div className="right">
        <Navbar></Navbar>
        <h1>Hi User</h1>
        <br></br>
        <div className="combinethree">
          <Equity />
          <Commodity />
          <Portfolio />
        </div>

        <div className="holding">
          <h1>Holdings</h1>
          <Holding />
        </div>
        <br></br>
        <HoldingBarGraph></HoldingBarGraph>
      </div>
    </div>
  );
}

export default MainContent;
