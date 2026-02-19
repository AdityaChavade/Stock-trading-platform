import './Navbar.css'; // Import the standard CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      
      {/* Left Side: Logo */}
      <div className="logo-container">
        <div className="kite-logo"></div>
      </div>

      {/* Right Side: Links & User Profile */}
      <div className="right-section">
        
        {/* Navigation Links */}
        <div className="nav-links">
          <a href="#" className="active">Dashboard</a>
          <a href="#">Orders</a>
          <a href="#">Holdings</a>
          <a href="#">Positions</a>
          <a href="#">Funds</a>
          <a href="#">Apps</a>
        </div>

        {/* User Profile Section */}
        <div className="user-profile">
          <div className="avatar">
             <img 
               src="https://ui-avatars.com/api/?name=User&background=fbcfe8&color=000" 
               alt="avatar" 
             />
          </div>
          <span className="user-id">XX0000</span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;