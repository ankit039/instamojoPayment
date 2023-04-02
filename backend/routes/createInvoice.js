const express = require("express");
var bodyParser = require("body-parser");
const validator = require("../helpers/validate");

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

const User = require("../models/userModel");
const Invoice = require("../models/invoiceModel");

apiRouter.route("/").post((req, res, next) => {
   // `/create` Request
   /*
   * Sample Body
   {
    username: "",
    email: "",
    phone: "",
    purpose: "",
    amount: ""
   }
   */
  console.log("createInvoice");

  //validate user response
  const validationRule = {
    username: "required|string",
    email: "required|string|email",
    phone: "required|string|size:10",
    purpose: "required|string",
    amount: "required|integer",
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
        if (callbackData.length != 0) {
          //new logic to insert data in Invoice Model
          Invoice.create(req.body).then((invoiceData) => {
            res.status(200).send({
              success: true,
              message: "Invoice Inserted",
              data: invoiceData,
            });
          });
        } else {
          res.status(412).send({
            success: false,
            message: "User Doest Not Exists",
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
