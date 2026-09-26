import { useAccount } from "../context/accountcontext";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function TotalFunds() {
  const { funds, loading } = useAccount();

  return (
    <div className="dashboard-card card-funds">
      <div className="card-header">
        <span className="card-label">Total Funds</span>
        <div className="card-icon icon-funds">
          <AccountBalanceWalletIcon fontSize="small" />
        </div>
      </div>
      <h2 className="card-value">
        {loading ? "..." : `₹${funds.toLocaleString()}`}
      </h2>
      <span className="card-subtext">Available for trading</span>
    </div>
  );
}

export default TotalFunds;
