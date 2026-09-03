import axios from "axios";
import { useEffect, useState } from "react";
function Positions() {
  let [positions, setpositions] = useState([]);
  useEffect(() => {
    let allpositions = axios
      .get("http://localhost:3000/allPositions")
      .then((result) => {
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
            </tr>
          </thead>

            <tbody>
              {positions.map((stock, idx) => (
                <tr key={idx}>
                  <td>{stock.Instrument}</td>
                  <td>{stock.Pro_Type}</td>
                  <td>{stock.Qty}</td>
                  <td>{stock.LTP}</td>
                  <td>{stock.Curr_val}</td>
                  <td>{stock.PL}</td>
                  <td>{stock.Chg}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default Positions;
