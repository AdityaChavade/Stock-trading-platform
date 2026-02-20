import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";
import { useState } from "react";
import "./liststock.css";
import { BarChartOutlined } from "@mui/icons-material";
function ListStock({ stock, change, value }) {
  const isProfit = change >= 0;
  let [showoptions, setoptions] = useState(false);
  return (
    <div className="stock-container">
      <li
        onMouseEnter={() => setoptions(true)}
        onMouseLeave={() => setoptions(false)}
        className="stock-row"
        style={{
          color: isProfit ? "green" : "red",
          fontWeight: 600,
        }}
      >
        {stock}
        <span className="stock-change">{change}</span>
        <span className="stock-value">{value}</span>

        {showoptions && <WatchListActions uid={stock}></WatchListActions>}
      </li>
    </div>
  );
}

function WatchListActions({ uid }) {
  return (
    <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
      <div className="button-container">
        <button className="buy-btn">Buy</button>
        <button className="sell-btn">Sell</button>
        <button>
          <BarChartOutlined></BarChartOutlined>
        </button>
      </div>
    </Tooltip>
    
  );
}

export default ListStock;
