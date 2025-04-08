const router = require("express").Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");
const logAction = require("../middleware/logAction");
const json2csv = require("json2csv").parse;

router.post("/save", auth, async (req, res) => {
  const report = await Report.create({ ...req.body, author: req.user.userId });
  await logAction(req.user.userId, "Saved report", report._id);
  res.json(report);
});

router.get("/search", async (req, res) => {
  const q = req.query.q;
  const results = await Report.find({
    $or: [
      { patientName: new RegExp(q, "i") },
      { modality: new RegExp(q, "i") },
      { region: new RegExp(q, "i") },
      { reportText: new RegExp(q, "i") }
    ]
  });
  res.json(results);
});

router.get("/export/csv", auth, async (req, res) => {
  const reports = await Report.find({ author: req.user.userId });
  const csv = json2csv(reports);
  res.header("Content-Type", "text/csv");
  res.attachment("reports.csv");
  res.send(csv);
});

module.exports = router;
