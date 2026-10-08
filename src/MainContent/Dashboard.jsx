import TotalFunds from "./TotalFunds";
import AccountValue from "./AccountValue";
import AccountValueChart from "./AccountValueChart";
import TotalOrders from "./TotalOrders";
import TotalPositions from "./TotalPositions";
import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Summary</h1>
      <div className="dashboard-cards-grid">
        <TotalFunds />
        <AccountValue />
      </div>
      <div style={{ marginTop: "24px" }}>
        <AccountValueChart />
      </div>
    </div>
  );
}

export default Dashboard;
