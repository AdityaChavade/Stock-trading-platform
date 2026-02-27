import axios from "axios";
import { useEffect, useState } from "react";
function Positions() {
  let [positions, setpositions] = useState([]);
  useEffect(() => {
    let allpositions = axios
      .get("http://localhost:3000/allPositions")
      .then((result) => {
        console.log(result.data);
        setpositions(result.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  return (
    <div className="posistion">
      <h1>Holings : {positions.length}</h1>

      <div className="table-data">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Pro type</th>
            <th>Qty</th>
            <th>Avg.cost</th>
            <th>LTP</th>
            <th>Curr. val</th>
            <th>P&L</th>
            <th>Chg</th>
          </tr>
          {positions.map((stock, idx) => {
            return (
              <tr key={idx}>
                <td>{stock.Instrument}</td>
                <td>{stock.Pro_Type}</td>
                <td>{stock.qty}</td>
                <td>-</td>
                <td>{stock.LTP}</td>
                <td>{stock.Curr_val}</td>
                <td className={stock.PL >= 0 ? "profit" : "loss"}>
                  {stock.PL}
                </td>
                <td style={{ color: stock.Chg >= 0 ? "green" : "red" }}>
                  {stock.Chg}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default Positions;
