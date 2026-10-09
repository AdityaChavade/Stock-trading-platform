import axios from "axios";
import { useEffect, useState } from "react";
function Positions() {

  let [positions, setpositions] = useState([]);
  useEffect(() => {
    let allpositions = axios
      .get("http://localhost:3000/position/allPositions", { withCredentials: true })
      .then((result) => {
        setpositions(result.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  let sellPosition = (stock) => {
    axios
      .post(
        "http://localhost:3000/order",
        {
          Instruments: stock.Instrument,
          Type: stock.Pro_Type || "CNC",
          Action: "SELL",
          OrderType: "LIMIT",
          Avg_Price: stock.LTP,
          Qty: stock.Qty,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Sell order created successfully:", res.data);
      })
      .catch((error) => {
        console.log("error selling position:", error);
      });
  };
  return (
    <div className="posistion">
      <h1>Positions : {positions.length}</h1>

      <div className="table-data">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Pro type</th>
              <th>Qty</th>
              <th>Avg.cost</th>
              <th>LTP</th>
              <th>Curr. val</th>
              <th>P&L</th>
              <th>Chg</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.Instrument}</td>
                <td>{stock.Pro_Type}</td>
                <td>{stock.Qty}</td>
                <td>{stock.LTP}</td>
                <td>{stock.Curr_val}</td>
                <td className={stock.PL > 0 ? "gain" : "loss"}>{stock.PL}</td>
                <td className={stock.Chg > 0 ? "gain" : "loss"}>{stock.Chg}</td>
                <td>
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#09a6ffff",
                      color: "white",
                      border: "none",
                      padding: "5px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                    onClick={() => sellPosition(stock)}
                  >
                    SELL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Positions;
