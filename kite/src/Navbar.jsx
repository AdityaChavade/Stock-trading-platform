import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo-container">
        <div className="kite-logo"></div>
      </div>

      {/* Right Section */}
      <div className="right-section">

        {/* Links */}
        <div className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/holdings">Holdings</NavLink>
          <NavLink to="/positions">Positions</NavLink>
          <NavLink to="/funds">Funds</NavLink>
          <NavLink to="/holdings">Holdings</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/holdings">Holdings</NavLink>
              <NavLink to="/logout">Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="user-profile">
          <img
            className="avatar"
            src="https://ui-avatars.com/api/?name=User&background=fbcfe8&color=000"
            alt="avatar"
          />
          <span>XX0000</span>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
