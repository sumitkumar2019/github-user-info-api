const express = require("express");
const GitService = require("../service/GitService");

const router = express.Router();

router.get("/getusers/:city/page/:pageNumber", async function(req, res, next) {
  const city = req.params.city;
  const pageNumber = req.params.pageNumber;
  if (!pageNumber) {
    pageNumber = 1;
  }
  try {
    const data = await new GitService().getGitUser(city, pageNumber);
    console.log("inside get git user" + data);
    res.status(200).send({ success: true, result: data });
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

module.exports = router;
