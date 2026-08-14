import { user } from "./user.js";
import "./HoldingBarGraph.css";

function HoldingBarGraph() {
  const invested = user.holding.investment;
  const current = user.holding.current_value;

  const maxValue = Math.max(invested, current);

  const investedWidth = (invested / maxValue) * 100;
  const currentWidth = (current / maxValue) * 100;

  return (
    <div className="bargraph">
      <h3>Investment vs Current Value</h3>

      <div className="bar-row">
        <span className="label">Invested</span>
        <div className="bar-container">
          <div
            className="bar invested"
            style={{ width: `${investedWidth}%` }}
          />
        </div>
        <span className="value">{invested}</span>
      </div>

      <div className="bar-row">
        <span className="label">Current</span>
        <div className="bar-container">
          <div
            className="bar current"
            style={{ width: `${currentWidth}%` }}
          />
        </div>
        <span className="value">{current}</span>
      </div>
    </div>
  );
}

export default HoldingBarGraph;
