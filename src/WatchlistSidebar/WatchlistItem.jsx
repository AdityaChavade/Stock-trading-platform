import { useState, useEffect } from "react";
import { index } from "./index.js";
import "./Watchlist.css";
import SearchBar from "./SearchBar.jsx";
import { Tooltip, Grow } from "@mui/material";
import ListStock from "./ListStock.jsx";
import axios from "axios";
import { io } from "socket.io-client";

function Watchlistitem() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    // 1. Initial Watchlist fetch
    axios
      .get("http://localhost:3000/api/watchlist", { withCredentials: true })
      .then((res) => {
        const mappedStocks = res.data.map((entry) => ({
          id: entry.Stock.id,
          stock: entry.Stock.companyName || entry.Stock.symbol,
          value: entry.Stock.price,
          change: 0 // Default change
        }));
        setWatchlist(mappedStocks);
      })
      .catch((err) => {
        console.error("Failed to fetch watchlist:", err);
      });
      
    // 2. Setup Socket.IO connection
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    // 3. Listen for price updates
    socket.on("stockPriceUpdate", (data) => {
      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((item) =>
          item.id === data.stockId
            ? { ...item, value: data.price }
            : item
        )
      );
    });

    // 4. Cleanup on unmount
    return () => {
      socket.off("stockPriceUpdate");
      socket.disconnect();
    };
  }, []);

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
        <span> {watchlist.length}/50</span>
        {watchlist.map((stockitem, idx) => (
          <ListStock
            key={idx}
            symbol={stockitem.stock}
            change={stockitem.change}
            value={stockitem.value}
          ></ListStock>
        ))}
      </ul>
    </div>
  );
}

export default Watchlistitem;
