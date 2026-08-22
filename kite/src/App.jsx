import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContent from "./MainContent/MainContent";
import Dashboard from "./MainContent/Dashboard";
import Orders from "./MainContent/Orders";
import Funds from "./MainContent/Funds";
import Position from "./MainContent/Position";
import HoldingPage from "./MainContent/HoldingPage";
import Signup from "./MainContent/Signup";
import Login from "./MainContent/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContent />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="funds" element={<Funds />} />
          <Route path="positions" element={<Position/>} />
          <Route path="holdings" element={<HoldingPage />} />
        </Route>

        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
