import { user } from "./user.js";
import "./Portfolio.css";

function Portfolio() {
  return (
    <div className="portfolio">

      <div className="portfolio-main">
        <div className="portfolio-item">
          <span className="value">{user.portfolio.pending_orders}</span>
          <span className="label">Pending Orders</span>
        </div>

        <div className="portfolio-item">
          <span className="value">{user.portfolio.holdings}</span>
          <span className="label">Holdings</span>
        </div>

        <div className="portfolio-item">
          <span className="value">{user.portfolio.positions}</span>
          <span className="label">Positions</span>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
