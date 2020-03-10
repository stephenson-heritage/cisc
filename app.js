const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const defaultRouter = require("./routes/pageRoute");

const app = express();

const port = 2000;

app.use(cookieParser());
app.use("/", defaultRouter);

app.listen(port, () => {
  db.init();
  console.log(`listening on port: ${port}`);
});
