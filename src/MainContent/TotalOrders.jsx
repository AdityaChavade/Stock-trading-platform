import { useAccount } from "../context/accountcontext";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

function TotalOrders() {
  const { orders, loading } = useAccount();

  return (
    <div className="dashboard-card card-orders">
      <div className="card-header">
        <span className="card-label">Total Orders</span>
        <div className="card-icon icon-orders">
          <ReceiptLongIcon fontSize="small" />
        </div>
      </div>
      <h2 className="card-value">
        {loading ? "..." : orders.length}
      </h2>
      <span className="card-subtext">Executed & pending orders</span>
    </div>
  );
}

export default TotalOrders;
