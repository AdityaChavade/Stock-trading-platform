import { useEffect, useState } from "react";
import { user } from "./user.js";
import "./Portfolio.css";
import axios from "axios";
import { io } from "socket.io-client";

function Portfolio() {
  const [positionsPnL, setPositionsPnL] = useState(0);

  useEffect(() => {
    // 1. Initial positions fetch to compute net PnL
    axios
      .get("http://localhost:3000/position/allPositions", { withCredentials: true })
      .then((res) => {
        const sum = res.data.reduce((acc, p) => acc + (Number(p.PL) || 0), 0);
        setPositionsPnL(sum);
      })
      .catch((err) => console.error("Error fetching portfolio positions:", err));

    // 2. Connect to WebSocket
    const socket = io("http://localhost:3000", { withCredentials: true });

    // Listen for direct net PnL calculation from backend
    socket.on("positionPnLUpdate", (data) => {
      if (typeof data.netPnL === "number") {
        setPositionsPnL(data.netPnL);
      }
    });

    return () => {
      socket.off("positionPnLUpdate");
      socket.disconnect();
    };
  }, []);

  const isProfit = positionsPnL >= 0;

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

        <div className="portfolio-item">
          <span
            className="value"
            style={{ color: isProfit ? "#4caf50" : "#df514c", fontWeight: "bold" }}
          >
            {isProfit ? `+₹${positionsPnL.toFixed(2)}` : `-₹${Math.abs(positionsPnL).toFixed(2)}`}
          </span>
          <span className="label">Positions P&L</span>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
