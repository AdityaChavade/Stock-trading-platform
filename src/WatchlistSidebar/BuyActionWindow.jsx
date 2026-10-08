import React, { useContext, useState } from "react";
import { Context } from "./GeneralContext";
import Draggable from 'react-draggable';
import "./buyaction.css";
import axios from "axios";

import { useAccount } from "../context/accountcontext";

const BuyActionWindow = ({ uid, price, action }) => {
  const { closeActionWindow } = useContext(Context);
  const { refetchAccountData } = useAccount();
  const [qty, setqty] = useState(1);
  const [orderType, setOrderType] = useState("MARKET"); // "MARKET" or "LIMIT"
  const [trigger, setrigger] = useState(price);

  let handlesubmit = async (e) => {
    e.preventDefault();
    const finalPrice = orderType === "MARKET" ? price : trigger;
    try {
      if (orderType === "MARKET") {
        await axios.post(
          "http://localhost:3000/position/position",
          {
            Instrument: uid,
            Pro_Type: "CNC",
            Action: action || "BUY",
            LTP: Number(finalPrice),
            Qty: Number(qty),
          },
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          "http://localhost:3000/order",
          {
            Instruments: uid,
            Type: "CNC",
            Action: action || "BUY",
            OrderType: orderType,
            Avg_Price: Number(finalPrice),
            Qty: Number(qty),
          },
          {
            withCredentials: true,
          }
        );
      }
      refetchAccountData();
      closeActionWindow();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Draggable handle=".window-header">
      <div className="buy-window">
        <div className={`window-header ${action === "Sell" ? "sell-header" : "buy-header"}`}>
          <h2 className="window-title">{action || "BUY"}: {uid}</h2>
          <span className="close-icon" onClick={closeActionWindow}>&times;</span>
        </div>
        <form className={`buy-form ${action === "Sell" ? "sell-mode" : "buy-mode"}`} onSubmit={handlesubmit}>
          <div className="price-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>LTP : ₹{price}</span>
            <div className="order-type-selector">
              <label style={{ marginRight: '8px', fontSize: '13px' }}>
                <input
                  type="radio"
                  name="orderType"
                  value="MARKET"
                  checked={orderType === "MARKET"}
                  onChange={() => setOrderType("MARKET")}
                /> Market
              </label>
              <label style={{ fontSize: '13px' }}>
                <input
                  type="radio"
                  name="orderType"
                  value="LIMIT"
                  checked={orderType === "LIMIT"}
                  onChange={() => setOrderType("LIMIT")}
                /> Limit
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Price</label>
            <input
              className="price-input"
              type="number"
              placeholder="Price"
              value={orderType === "MARKET" ? price : trigger}
              disabled={orderType === "MARKET"}
              onChange={(e) => setrigger(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Qty.</label>
            <input
              className="qty-input"
              type="number"
              placeholder="QTY"
              value={qty}
              onChange={(e) => setqty(Number(e.target.value))}
            />
          </div>

          <div className="buttons-container">
            <button type="button" className="cancel-btn" onClick={closeActionWindow}>
              Cancel
            </button>
            <button type="submit" className={`submit-btn ${action === "Sell" ? "sell-btn-action" : "buy-btn-action"}`}>
              Execute
            </button>
          </div>
        </form>
      </div>
    </Draggable>
  );
};

export default BuyActionWindow;
