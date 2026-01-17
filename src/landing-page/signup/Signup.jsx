import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./signup.css";
export default function Signup() {
  return (
   <div className="signup-button">
     <Stack spacing={2} direction="row">
      <Button sx={{  textTransform: "none", fontSize:"30px"}}size="large" variant="contained">Sign up for free</Button>
    </Stack>
   </div>
  );
}
