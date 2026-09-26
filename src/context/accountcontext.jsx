import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AccountContext = createContext();

export function AccountProvider({ children }) {
  const [funds, setFunds] = useState(0);
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccountData = async () => {
    try {
      setLoading(true);

      const [fundsRes, holdingsRes, ordersRes, positionsRes] = await Promise.allSettled([
        axios.get("http://localhost:3000/getFunds", { withCredentials: true }),
        axios.get("http://localhost:3000/allHoldings", { withCredentials: true }),
        axios.get("http://localhost:3000/allOrders", { withCredentials: true }),
        axios.get("http://localhost:3000/position/allPositions", { withCredentials: true }),
      ]);

      if (fundsRes.status === "fulfilled") {
        setFunds(fundsRes.value.data.funds || 0);
      }
      if (holdingsRes.status === "fulfilled") {
        setHoldings(holdingsRes.value.data || []);
      }
      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value.data || []);
      }
      if (positionsRes.status === "fulfilled") {
        setPositions(positionsRes.value.data || []);
      }
    } catch (error) {
      console.error("Error loading account context data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        funds,
        orders,
        holdings,
        positions,
        loading,
        refetchAccountData: fetchAccountData,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
