import { useState } from "react";
import { item, index } from "./index.js";
import "./Watchlist.css";
import SearchBar from "./SearchBar.jsx";
import { Tooltip, Grow } from "@mui/material";
import ListStock from "./ListStock.jsx";

function Watchlistitem() {
  return (
    <div className="watchlist">
      <div className="index">
        <div className="index-item">
          <span className="index-name">NIFTY 50</span>
          <span className="index-value">{index.nifty.value}</span>
          <span className={index.nifty.change >= 0 ? "positive" : "negative"}>
            {index.nifty.change}%
          </span>
        </div>

        <div className="index-item">
          <span className="index-name">SENSEX</span>
          <span className="index-value">{index.sensex.value}</span>
          <span className={index.sensex.change >= 0 ? "positive" : "negative"}>
            {index.sensex.change}%
          </span>
        </div>
      </div>

      <SearchBar></SearchBar>

      <ul className="stock-item">
        <span> {item.length}/50</span>
        {item.map((stockitem, idx) => (
          <ListStock
            key={idx}
            stock={stockitem.stock}
            change={stockitem.change}
            value={stockitem.value}
          ></ListStock>
        ))}
      </ul>
    </div>
  );
}

export default Watchlistitem;
