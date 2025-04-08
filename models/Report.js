const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  patientName: String,
  age: String,
  gender: String,
  modality: String,
  region: String,
  studyDate: Date,
  reportText: String,
  templateUsed: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pacsLink: String,
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);
