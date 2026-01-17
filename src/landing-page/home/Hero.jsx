import Signup from "../signup/Signup";
import "./hero.css";
import "./button.css";
function Hero() {
    return ( 
        <div className="hero">
           <img src=".\Images\kite.png"></img>
           <h1>Invest in everything</h1>
           <br></br>
           <h2>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</h2>
          <br></br>
          <br></br>
          <div className="button">
              <Signup></Signup>
          </div>

        </div>
     );
}

export default Hero;