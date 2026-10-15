import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Positions() {
  let [positions, setpositions] = useState([]);

  useEffect(() => {
    // 1. Fetch initial positions
    axios
      .get("http://localhost:3000/position/allPositions", { withCredentials: true })
      .then((result) => {
        setpositions(result.data);
      })
      .catch((error) => {
        console.log("error", error);
      });

    // 2. Setup WebSocket connection for live price updates
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("stockPriceUpdate", (data) => {
      setpositions((prevPositions) =>
        prevPositions.map((pos) => {
          // Check match against symbol or stockId
          const isMatch =
            (pos.Instrument && data.symbol && pos.Instrument.toUpperCase() === data.symbol.toUpperCase());

          if (isMatch) {
            const newLTP = Number(data.price);
            const avg = Number(pos.Avg_Price);
            const invested = pos.Qty * avg;
            const newCurrVal = pos.Qty * newLTP;
            const newPL = newCurrVal - invested;
            const newChg = invested ? (newPL / invested) * 100 : 0;

            return {
              ...pos,
              LTP: Number(newLTP.toFixed(2)),
              Curr_val: Number(newCurrVal.toFixed(2)),
              PL: Number(newPL.toFixed(2)),
              Chg: Number(newChg.toFixed(2)),
            };
          }
          return pos;
        })
      );
    });

    // 3. Cleanup on unmount
    return () => {
      socket.off("stockPriceUpdate");
      socket.disconnect();
    };
  }, []);
  let sellPosition = (stock) => {
    axios
      .post(
        "http://localhost:3000/order",
        {
          Instruments: stock.Instrument,
          Type: stock.Pro_Type || "CNC",
          Action: "SELL",
          OrderType: "MKT",
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
                <td>{Number(stock.Avg_Price).toFixed(2)}</td>
                <td>{Number(stock.LTP).toFixed(2)}</td>
                <td className={stock.PL >= 0 ? "gain" : "loss"}>{Number(stock.PL).toFixed(2)}</td>
                <td className={stock.Chg >= 0 ? "gain" : "loss"}>{Number(stock.Chg).toFixed(2)}%</td>
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
