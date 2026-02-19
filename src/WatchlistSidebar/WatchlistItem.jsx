import { useState } from "react";
import { item, index } from "./index.js";
import "./Watchlist.css";

function Watchlistitem() {
  const [stocks] = useState(item);

  return (
    <div className="watchlist">
      <div className="index">
        <div className="index-item">
          <span className="index-name">NIFTY 50</span>
          <span className="index-value">{index.nifty.value}</span>
          <span className="positive">{index.nifty.change}%</span>
        </div>

        <div className="index-item">
          <span className="index-name">SENSEX</span>
          <span className="index-value">{index.sensex.value}</span>
          <span className={index.change >= 0 ? "positive" : "negative"}>
            {index.sensex.change}%
          </span>
        </div>
      </div>

      <ul className="stock-item">
        {stocks.map((stockitem, idx) => (
          <li
            key={idx}
            className="stock-row"
            style={{
              color: stockitem.change >= 0 ? "green" : "red",
              fontWeight: 600,
            }}
          >
            {stockitem.stock}
            <span className="stock-change">{stockitem.change}</span>
            <span
              className="stock-value"
              style={{
                color: stockitem.change >= 0 ? "green" : "red",
                fontWeight: 600,
              }}
            >
              {stockitem.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Watchlistitem;
