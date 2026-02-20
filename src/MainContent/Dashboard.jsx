import Equity from "./Equity";
import Commodity from "./Commodity";
import Portfolio from "./Portfolio";
import Holding from "./Holding";
import HoldingBarGraph from "./HoldingBarGraph";
function Dashboard() {
  return (
    <div className="dashboard">
      <br></br>
      <h1>Hi User</h1>
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
  );
}

export default Dashboard;
