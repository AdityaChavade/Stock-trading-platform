import Signup from "../signup/Signup";
import "./hero.css";
import "./button.css";
import Pricing from "./Pricing";
import Trust from "./Trust";
function Hero() {
  return (
    <div className="hero">
      <div>
        <img src=".\Images\kite.png"></img>
        <h1>Invest in everything</h1>
        <br></br>
        <h2>
          Online platform to invest in stocks, derivatives, mutual funds, ETFs,
          bonds, and more.
        </h2>
        <br></br>
        <br></br>
        <div className="button">
          <Signup></Signup>
        </div>
      </div>
      <Trust></Trust>
      <Pricing></Pricing>
    </div>
  );
}

export default Hero;
