const router = require("express").Router();

router.post("/ris/receive", (req, res) => {
  console.log("Received RIS payload", req.body);
  res.send("OK");
});

router.post("/link", async (req, res) => {
  const { accessionNumber } = req.body;
  const pacsURL = `https://yourpacs/viewer?acc=${accessionNumber}`;
  res.json({ url: pacsURL });
});

module.exports = router;
