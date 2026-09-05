import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to log out on backend to clear cookie, if there's a logout endpoint
    axios.post(
      "http://localhost:3000/logout",
      {},
      { withCredentials: true }
    ).catch(() => {
      // Ignore errors if endpoint doesn't exist yet
    }).finally(() => {
      // Always remove token and redirect
      localStorage.removeItem("token");
      navigate("/login");
    });
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <h2>Logging out...</h2>
    </div>
  );
}

export default Logout;
