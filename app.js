const express = require("express");
const session = require("express-session");
var flash = require("connect-flash");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
var passport = require("./security/passport");
require("dotenv").config();
const port = 3002;
const modals = require("./models");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

modals.sequelize
  .sync({
    logging: console.log,
    force: false
  })
  .then(() => {
    console.log("Connection to Databse established Successfully");
  })
  .catch(err => {
    console.error("unable to connect to the databse:", err);
  });

app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");

app.use("/", routes);
app.use(
  "/git/api",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

module.exports = app;
