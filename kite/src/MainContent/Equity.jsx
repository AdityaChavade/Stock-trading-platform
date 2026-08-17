import { user } from "./user.js";
import "./Equity.css";
function Equity() {
  return (
    
    <div className="equity">
      <div className="account-balance">
        <span className="value" style={{ fontSize: "40px", fontWeight: "400" }}>{user.equity.Availble_balance}</span>
        <span className="label">Available Balance</span>
      </div>
      <div className="additional">
        <span className="margin-used">Margin used {user.equity.margin_used}</span>
        <span className="account-value"> Account value{user.equity.Account_value}</span>
      </div>
    </div>
    
  );
}

export default Equity;
