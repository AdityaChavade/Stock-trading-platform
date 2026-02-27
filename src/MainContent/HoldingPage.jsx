import { useEffect, useState } from "react";
import "./holdingpage.css";
import axios from "axios";

function HoldingPage() {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/allHoldings")
      .then((result) => {
        console.log(result.data)
        setHoldings(result.data);
      })
      .catch((error) => {
        console.log("error occurred!", error);
      });
  }, []);

  return (
    <div>
      <h1>Holdings: {holdings.length}</h1>

      <div className="table-data">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty</th>
              <th>Avg.cost</th>
              <th>LTP</th>
              <th>Curr. val</th>
              <th>P&amp;L</th>
              <th>Net chg</th>
              <th>Day chg</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((stock) => {
              const isProfit = stock.price >= stock.avg;
              const pnl = (stock.price - stock.avg) * stock.qty;

              return (
                <tr key={stock.name}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg}</td>
                  <td>{stock.price}</td>
                  <td>{(stock.qty * stock.price).toFixed(2)}</td>
                  <td className={pnl >= 0 ? "profit" : "loss"}>
                    {pnl.toFixed(2)}
                  </td>
                  <td>{stock.net}</td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {stock.day}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HoldingPage;