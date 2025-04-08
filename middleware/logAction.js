const Audit = require("../models/Audit");

module.exports = async function (userId, action, target) {
  await Audit.create({ userId, action, target });
};
