import { user } from "./user.js";
import "./Holding.css";

function Holding() {
  return (
    <div className="holding">
      <div className="holding-status">
        <div className="current">
          <span className="label">Current Value</span>
          <span>{user.holding.current_value}</span>
        </div>

        <div className="invested">
          <span>{user.holding.investment}</span>
          <span>Invested Value</span>
        </div>
        <div className="pnl">
          <span>{user.holding.pnl}</span>
          <span>PNL</span>
        </div>
      </div>
    </div>
  );
}

export default Holding;
