import TotalFunds from "./TotalFunds";
import AccountValue from "./AccountValue";
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
    </div>
  );
}

export default Dashboard;
