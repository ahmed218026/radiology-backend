const router = require("express").Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");
const logAction = require("../middleware/logAction");
const json2csv = require("json2csv").parse;
const { Document, HeadingLevel, Packer, Paragraph } = require("docx");

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

router.get("/export/docx/:id", auth, async (req, res) => {
  const report = await Report.findOne({
    _id: req.params.id,
    author: req.user.userId
  });

  if (!report) {
    return res.status(404).send("Report not found");
  }

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Radiology Report",
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph(`Patient Name: ${report.patientName || "N/A"}`),
          new Paragraph(`Age: ${report.age || "N/A"}`),
          new Paragraph(`Gender: ${report.gender || "N/A"}`),
          new Paragraph(`Modality: ${report.modality || "N/A"}`),
          new Paragraph(`Region: ${report.region || "N/A"}`),
          new Paragraph(
            `Study Date: ${
              report.studyDate ? report.studyDate.toISOString().slice(0, 10) : "N/A"
            }`
          ),
          new Paragraph(""),
          new Paragraph({
            text: "Findings",
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph(report.reportText || "")
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  res.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.attachment(`report-${report._id}.docx`);
  res.send(buffer);
});

module.exports = router;
