import { user } from "./user.js";
import "./commodity.css";
function Commodity() {
  return (
    <div className="commodity">
      <div className="commodity-balance">
        <span className="value" style={{ fontSize: "40px", fontWeight: "400" }}>{user.commodity.Availble_balance}</span>
        <span className="label">Available Balance</span>
      </div>
      <div className="additional">
        <span className="margin-used">Margin used {user.commodity.margin_used}</span>
        <span className="account-value"> Account value {user.commodity.Account_value}</span>
      </div>
    </div>
  );
}

export default Commodity;
