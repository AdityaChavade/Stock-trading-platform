import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContent from "./MainContent/MainContent";
import Dashboard from "./MainContent/Dashboard";
import Orders from "./MainContent/Orders";
import Funds from "./MainContent/Funds";
import Position from "./MainContent/Position";
import HoldingPage from "./MainContent/HoldingPage";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Logout from "./Auth/Logout";
import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainContent />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="funds" element={<Funds />} />
            <Route path="positions" element={<Position/>} />
            <Route path="holdings" element={<HoldingPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
