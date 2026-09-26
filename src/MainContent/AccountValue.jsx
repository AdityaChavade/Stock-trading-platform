import { useAccount } from "../context/accountcontext";
import ShowChartIcon from '@mui/icons-material/ShowChart';

function AccountValue() {
  const { funds, holdings, loading } = useAccount();

  const holdingsTotalValue = holdings.reduce((acc, curr) => {
    const price = parseFloat(curr.price) || 0;
    const qty = parseInt(curr.qty, 10) || 0;
    return acc + price * qty;
  }, 0);

  const accountValue = funds + holdingsTotalValue;

  return (
    <div className="dashboard-card card-account">
      <div className="card-header">
        <span className="card-label">Account Value</span>
        <div className="card-icon icon-account">
          <ShowChartIcon fontSize="small" />
        </div>
      </div>
      <h2 className="card-value">
        {loading ? "..." : `₹${accountValue.toLocaleString()}`}
      </h2>
      <span className="card-subtext">Holdings + Available Funds</span>
    </div>
  );
}

export default AccountValue;
