import { useAccount } from "../context/accountcontext";
import QueryStatsIcon from '@mui/icons-material/QueryStats';

function TotalPositions() {
  const { positions, loading } = useAccount();

  return (
    <div className="dashboard-card card-positions">
      <div className="card-header">
        <span className="card-label">Total Positions</span>
        <div className="card-icon icon-positions">
          <QueryStatsIcon fontSize="small" />
        </div>
      </div>
      <h2 className="card-value">
        {loading ? "..." : positions.length}
      </h2>
      <span className="card-subtext">Active open positions</span>
    </div>
  );
}

export default TotalPositions;
