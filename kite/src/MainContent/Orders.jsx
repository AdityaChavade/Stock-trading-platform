import { TableHead } from "@mui/material";
import axios from "axios";
import "./orders.css";
import { useState, useEffect } from "react";
function Orders() {
  let [orders, setorders] = useState([]);
  useEffect(() => {
    let allOrders = axios
      .get("http://localhost:3000/allorders")
      .then((result) => {
        setorders(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="order-table">
      <table className="orderstable">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Type</th>
            <th>Price</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <tr key={item._id}>
              <td>{item.Instrument}</td>
              <td>{item.Type}</td>
              <td>{item.Avg_Price}</td>
              <td>{item.Qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
