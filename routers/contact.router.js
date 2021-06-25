/**
 * By clavatar
 */
const ContactModel = require("../models/contact.model");
const GenericPost = require("../libraries/middlewares/generic-post.middleware");
const GenericGet = require("../libraries/middlewares/generic-get.middleware");
//const UserControler = require("../controllers/user.controller");
const { normalizeActionName } = require("../custom-modules/zoro-utils");

var express = require("express");
var router = express.Router();

router.route("/").get(GenericGet(ContactModel)).post(GenericPost(ContactModel)); // POST user

// infer controller action method by action querry param and call it
router.route("/:action").post((req, res, next) => {
  let action = normalizeActionName(req.params.action);
  return UserControler[action](req, res, next);
});

module.exports = router;
