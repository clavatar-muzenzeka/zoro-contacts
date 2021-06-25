/**
 * By clavatar
 * generic mongoose post middleware
 */
const { NetworkAuthenticationRequire } = require("http-errors");
const { Mongoose } = require("mongoose");
const GenericReponse = require("../generic-response.class");

/**
 * Return get handler based on model provided in parameter
 * @param {Mongoose.Model} model model in witch data will be inserted
 */
module.exports = (model, contextName) => async (req, res, next) => {
  model.find({ deleted: false }, {}, req.query).exec((error, fetched) => {
    res.status(200).json(new GenericReponse(fetched, {}));
  });
};
