const express = require("express");
var bodyParser = require("body-parser");
const validator = require("../helpers/validate");

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

const User = require("../models/userModel");

apiRouter.route("/").post((req, res, next) => {
  console.log("signup");

  //validate user response
  const validationRule = {
    username: "required|string",
    email: "required|string|email",
    phone: "required|string|size:10",
  };

  async function checkValication() {
    await validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(412).send({
          success: false,
          message: "Validation failed",
          data: err,
        });
      } else {
        addData();
      }
    }).catch((err) => console.log(err));
  }

  checkValication();

  function addData() {
    User.find({ email: req.body.email })
      .then((callbackData) => {
        if (callbackData.length == 0) {
          User.create(req.body)
            .then((signupData) => {
                res.status(412).send({
                    success: false,
                    message: "User Exists",
                  });
            })
            .catch((err) => {
              res.status(412).send({
                success: false,
                message: "User Exists",
              });
            });
        } else {
          res.status(412).send({
            success: false,
            message: "User Exists",
          });
        }
      })
      .catch((err) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json([{ msg: "Some Error Occured", sucess: false }]);
      });
  }
});

module.exports = apiRouter;
