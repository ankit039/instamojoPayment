const express = require("express");
var bodyParser = require("body-parser");
const validator = require("../helpers/validate");

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

apiRouter.route("/").post((req, res, next) => {
  // `/get` Request
  /* Sample Body
  {
   email: ""
  }
  */
  //validate user response
  const validationRule = {
    email: "required|string|email"
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
        getData();
      }
    }).catch((err) => console.log(err));
  }

  checkValication();

  function getData() {
    console.log("getInvoice -> "+req.body.email);
    User.find({ email: req.body.email })
      .then((callbackData) => {
        if (callbackData.length != 0) {
          //new logic to find data for sent email
          Invoice.find({ email: req.body.email }).then(
            (invoiceData) => {
              res.status(200).send({
                success: true,
                message: "Invoice Data",
                data: invoiceData,
              });
            }
          );
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
