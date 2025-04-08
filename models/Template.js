const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  modality: String,
  region: String,
  content: String
});

module.exports = mongoose.model("Template", TemplateSchema);
