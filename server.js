const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://<sniperman700>:<sniper5473620>@cluster0.mongodb.net/radiology?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/templates", require("./routes/templateRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/pacs", require("./routes/integration"));

app.listen(5000, () => console.log("Server running on port 5000"));



