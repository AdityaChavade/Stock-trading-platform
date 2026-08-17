import { useState } from "react";
import WatchListActions from "./WatchListActions";
import "./liststock.css";

function ListStock({ stock, change, value }) {
  const isProfit = change >= 0;
  const [showoptions, setoptions] = useState(false);

  return (
    <li
      className="stock-row"
      onMouseEnter={() => setoptions(true)}
      onMouseLeave={() => setoptions(false)}
    >
      <span
        className="stock-name"
        style={{ color: isProfit ? "#4caf50" : "#e53935" }}
      >
        {stock}
      </span>

      <div className="stock-right">
        {!showoptions ? (
          <div className="stock-numbers">
            <span className="stock-change" style={{ color: isProfit ? "#4caf50" : "#e53935" }}>
              {change}%
            </span>
            <span className="stock-value">{value}</span>
          </div>
        ) : (
          <WatchListActions uid={stock} price={value} />
        )}
      </div>
    </li>
  );
}

export default ListStock;