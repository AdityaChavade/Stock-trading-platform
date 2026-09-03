import React, { useContext, useState } from "react";
import { Context } from "./GeneralContext";
import Draggable from 'react-draggable';
import "./buyaction.css";
import axios from "axios";

const BuyActionWindow = ({ uid, price, action }) => {
  const { closeActionWindow } = useContext(Context);
  const [qty, setqty] = useState([]);
  const [trigger, setrigger] = useState(price);
  let handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Instruments: uid,
          Type: "CNC",
          Action: action,
          Avg_Price: trigger,
          Qty: qty,
        }),
      });
      closeActionWindow();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Draggable handle=".window-header">
      <div className="buy-window">
        <div className={`window-header ${action === "Sell" ? "sell-header" : "buy-header"}`}>
          <h2 className="window-title">{action}: {uid}</h2>
          <span className="close-icon" onClick={closeActionWindow}>&times;</span>
        </div>
        <form className={`buy-form ${action === "Sell" ? "sell-mode" : "buy-mode"}`} onSubmit={handlesubmit}>
          <div className="price-info">
            <span>LTP : ₹{price}</span>
          </div>

          <div className="input-group">
            <label>Price</label>
            <input
              className="price-input"
              type="number"
              placeholder="Price"
              value={trigger}
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
