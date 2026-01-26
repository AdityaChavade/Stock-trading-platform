import ResponsiveAppBar from "./ResponsiveAppBar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./openaccount.css";
function Open_account() {
  return (
    <>
      <div>
        <ResponsiveAppBar />
        <h2>Open a free demat and trading account online</h2>
        <p>
          Start investing brokerage free and join a community of 1.6+ crore
          investors and traders
        </p>
        <div className="img-text">
          <img src=".\Images\signup.png"></img>
          <div className="form">
            <h3>Signup now</h3>
            <p>Or track your existing application</p>
            <input type="tel" placeholder="Enter your mobile number"></input>
            <Stack spacing={2} direction="row">
              <Button
                sx={{ textTransform: "none", fontSize: "30px" }}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
}

export default Open_account;
