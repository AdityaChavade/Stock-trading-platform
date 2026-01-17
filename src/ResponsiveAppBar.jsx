import "./navbar.css";
function ResponsiveAppBar() {
  return (
    <>
      <div className="container">
        <nav className="navbar">
          <div className="my-logo"><img src="https://logowik.com/content/uploads/images/zerodha6662.jpg"></img></div>
          <ul className="nav-links">
            <li>
              <a href="#">signup</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Product</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">Support</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default ResponsiveAppBar;
