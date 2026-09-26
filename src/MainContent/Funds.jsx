import { useAccount } from "../context/accountcontext";

function Funds() {
  const { funds, loading } = useAccount();

  if (loading) {
    return (
      <div className="funds">
        <h1>Loading funds...</h1>
      </div>
    );
  }

  return (
    <div className="funds">
      <h1>Funds : ₹{funds.toLocaleString()}</h1>
    </div>
  );
}

export default Funds;