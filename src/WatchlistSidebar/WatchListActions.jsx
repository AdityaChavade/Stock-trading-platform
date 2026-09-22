import { useContext } from "react";
import { Context } from "./GeneralContext";
import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";
import { BarChartOutlined } from "@mui/icons-material";

export default function WatchListActions({uid, price}) {
  const context = useContext(Context);
  return (
    <div className="container-button">
      <div className="buy-btn-container">
        <Tooltip title="Buy" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy-btn" onClick={() => context.openActionWindow(uid, price, "Buy")}>
            Buy
          </button>
        </Tooltip>
      </div>
      <div className="sell-btn-container">
        <Tooltip title="Sell" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell-btn" onClick={() => context.openActionWindow(uid, price, "Sell")}>
            Sell
          </button>
        </Tooltip>
      </div>
      <div className="chart-button-container">
        <Tooltip title="Chart" placement="top" arrow TransitionComponent={Grow}>
          <BarChartOutlined></BarChartOutlined>
        </Tooltip>
      </div>
    </div>
  );
}
