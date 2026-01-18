import "./pricing.css";
function Pricing() {
  return (
    <div className="pricing-hero">
      <div className="pricing-text">
        <h2>Unbeatable pricing</h2>
        <p>
          We pioneered the concept of discount broking and price transparency in
          India. Flat fees and no hidden charges.
        </p>
        <a href="#">see pricing</a>
      </div>
      <div className="image">
        <div className="item">
          <img src=".\Images\pricing0.svg" alt="image" />
          <p>Free account opening</p>
        </div>

        <div className="item">
          <img src=".\Images\pricing0.svg" alt="image" />
          <p>Free equity delivery and direct mutual funds</p>
        </div>
        <div className="item">
          <img src=".\Images\intradayTrades.svg" alt="image" />
          <p>Intraday and F&O</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
