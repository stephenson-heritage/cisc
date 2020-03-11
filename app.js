const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const defaultRouter = require("./routes/pageRoute");
const hbs = require("hbs");

const userModel = require("./model/userModel");

const app = express();
const port = 2000;

app.use(express.urlencoded({ extended: true }));
hbs.registerPartials(path.join(__dirname, "/views/parts"));
app.set("view engine", "hbs");
app.use(cookieParser());

app.use(
  "/res/",
  express.static(path.join(__dirname, "/public"))
);

app.post("/login", async (req, res) => {
  if (
    req.body.username !== undefined &&
    req.body.password !== undefined
  ) {
    let user = req.body.username.trim().toLowerCase();
    let pwd = req.body.password;

    const userStatus = await userModel.getAuthorized(user, pwd);

    if (userStatus.auth) {
      res.cookie("user", userStatus.user.username, {
        maxAge: 1000 * 60 * 60
      });
      res.cookie("chash", userStatus.cookieHash, {
        maxAge: 1000 * 60 * 60
      });
      res.send("logged in!");
    }
  }
  res.status(401).send();
});

app.use("/", defaultRouter);

app.listen(port, () => {
  db.init();
  console.log(`listening on port: ${port}`);
});
