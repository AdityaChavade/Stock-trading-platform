import { TableHead } from "@mui/material";
import axios from "axios";
import "./orders.css";
import { useState, useEffect } from "react";
function Orders() {
  let [orders, setorders] = useState([]);
  useEffect(() => {
    let allOrders = axios
      .get("http://localhost:3000/allOrders", { withCredentials: true })
      .then((result) => {
        setorders(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  let cancelOrder = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/cancelOrder/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setorders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="order-table">
      <table className="orderstable">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Type</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <tr key={item.id}>
              <td>{item.Instrument}</td>
              <td>{item.Type}</td>
              <td>{item.Avg_Price}</td>
              <td>{item.Qty}</td>
              <td>
                <button className="btn-danger" onClick={() => cancelOrder(item.id)}> Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
