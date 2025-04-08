const router = require("express").Router();
const User = require("../models/User");
const Audit = require("../models/Audit");
const auth = require("../middleware/auth");

router.get("/users", auth, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.delete("/user/:id", auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("User deleted");
});

router.get("/audits", auth, async (req, res) => {
  const logs = await Audit.find().populate("userId", "name").sort({ timestamp: -1 });
  res.json(logs);
});

router.get("/stats", auth, async (req, res) => {
  const users = await User.find();
  const stats = await Promise.all(users.map(async (u) => {
    const count = await require("../models/Report").countDocuments({ author: u._id });
    return { name: u.name, email: u.email, reports: count };
  }));
  res.json(stats);
});

module.exports = router;
