import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ toggleWatchlist, isWatchlistOpen }) => {
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
          <div className="mobile-watchlist-nav" onClick={toggleWatchlist} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px' }}>
            <span style={{ color: isWatchlistOpen ? '#f97316' : 'inherit' }}>Watchlist</span>
          </div>
          <NavLink to="/" end onClick={() => isWatchlistOpen && toggleWatchlist()}>Dashboard</NavLink>
          <NavLink to="/orders" onClick={() => isWatchlistOpen && toggleWatchlist()}>Orders</NavLink>
          <NavLink to="/positions" onClick={() => isWatchlistOpen && toggleWatchlist()}>Positions</NavLink>
          <NavLink to="/funds" onClick={() => isWatchlistOpen && toggleWatchlist()}>Funds</NavLink>
          <NavLink to="/holdings" onClick={() => isWatchlistOpen && toggleWatchlist()}>Holdings</NavLink>
        </div>

        {/* Auth / Profile */}
        <div className="user-profile-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isLoggedIn ? (
            <NavLink to="/logout" style={{ textDecoration: 'none', color: '#e53935', fontSize: '0.875rem' }}>Logout</NavLink>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <NavLink to="/login" style={{ textDecoration: 'none', color: '#6b7280' }}>Login</NavLink>
              <NavLink to="/signup" style={{ textDecoration: 'none', color: '#f97316' }}>Signup</NavLink>
            </div>
          )}
          <div className="user-profile">
            <img
              className="avatar"
              src="https://ui-avatars.com/api/?name=User&background=fbcfe8&color=000"
              alt="avatar"
            />
            <span>XX0000</span>
          </div>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
