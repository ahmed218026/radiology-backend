const router = require("express").Router();
const Template = require("../models/Template");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const templates = await Template.find();
  res.json(templates);
});

router.post("/", auth, async (req, res) => {
  const template = await Template.create(req.body);
  res.json(template);
});

router.delete("/:id", auth, async (req, res) => {
  await Template.findByIdAndDelete(req.params.id);
  res.send("Template deleted");
});

module.exports = router;
