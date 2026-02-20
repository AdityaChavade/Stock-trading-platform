import { positions } from "./data";
function Positions() {

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
                    const isProfit = stock.price >= stock.avg;
                    const profitclass = isProfit ? "profit" : "loss";
                    const dayClass = parseFloat(stock.day) >= 0 ? "profit" : "loss";
                    const pnl=(stock.price - stock.avg) * stock.qty;
        
                    return (
                      <tr key={idx} className="row">
                        <td>{stock.name}</td>
                        <td>{stock.product}</td>
                        <td>{stock.qty}</td>
                        <td>{stock.avg}</td>
                        <td>{stock.price}</td>
                        <td >{stock.qty * stock.price}</td>
                        <td className={profitclass} style={{color:pnl>=0?"green" :"red"}}>
                          {pnl.toFixed(2)}
                        </td>
                        <td style={{color:stock.change>=0?"green":"red"}}>{stock.change}%</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
    );
}

export default Positions;