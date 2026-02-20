import { holdings } from "./data";
import "./holdingpage.css";
function HoldingPage() {
  return (
    <div>
      <h1>Holings : {holdings.length}</h1>

      <div className="table-data">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Avg.cost</th>
            <th>LTP</th>
            <th>Curr. val</th>
            <th>P&L</th>
            <th>Net chg</th>
            <th>Day chg</th>
          </tr>
          {holdings.map((stock, idx) => {
            const isProfit = stock.price >= stock.avg;
            const profitclass = isProfit ? "profit" : "loss";
            const dayClass = parseFloat(stock.day) >= 0 ? "profit" : "loss";
            const pnl=(stock.price - stock.avg) * stock.qty;

            return (
              <tr key={idx} className="row">
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg}</td>
                <td>{stock.price}</td>
                <td >{stock.qty * stock.price}</td>
                <td className={profitclass} style={{color:pnl>=0?"green" :"red"}}>
                  {pnl.toFixed(2)}
                </td>
                <td>{stock.net}</td>
                <td
                  className="profit"
                  style={{
                    color: isProfit ? "#069b06" : "#ff0000",
                  }}
                >
                  {stock.day}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default HoldingPage;
