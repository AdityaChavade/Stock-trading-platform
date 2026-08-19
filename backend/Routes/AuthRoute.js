const { Signup, Login } = require("../Controller/AuthController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.send("working");
});

module.exports = router;
