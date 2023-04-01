const express = require("express");
var bodyParser = require("body-parser");
const User = require("../models/userModel");
const Invoice = require("../models/invoiceModel");

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());
require("dotenv").config();

const Insta = require("instamojo-nodejs");

apiRouter.route("/").post((req, res, next) => {
  console.log("payInvoice");
  //console.log(req.body);

  Insta.setKeys(process.env.INSTA_API_KEY, process.env.INSTA_AUTH_KEY);
  const instaPay = new Insta.PaymentData();
  Insta.isSandboxMode(true);

  var payObj = {};
  payObj.currency = "INR";
  payObj.buyer_name = req.body.invoiceData.buyer_name;
  payObj.email = req.body.invoiceData.email;
  payObj.phone = req.body.invoiceData.phone;
  payObj.send_sms = "False";
  payObj.send_email = "False";
  payObj.allow_repeated_payments = "False";
  //   payObj.webhook = req.body.invoiceData.webhook_url;
  payObj.webhook =
    process.env.PORT == undefined
      ? ""
      : "https://instabackend-sv8r.onrender.com/api/pay/webhook";
  payObj.redirect_url = req.body.invoiceData.redirect_url;
  payObj.purpose = req.body.invoiceData.purpose;
  payObj.amount = req.body.invoiceData.amount;
  //console.log("here", req.body.invoiceData);

  Insta.createPayment(payObj, function (error, response) {
    if (error) {
      // some error
      console.log(error, "here");
    } else {
      // Payment redirection link at response.payment_request.longurl
      /*
      {
    "success": true,
    "payment_request": {
        "id": "091216c655cd47fcb0f89210fd2ce2ae",
        "phone": "+918579961909",
        "email": "ankit@gmail.com",
        "buyer_name": "ankit039",
        "amount": "23673.00",
        "purpose": "Sigma",
        "expires_at": null,
        "status": "Pending",
        "send_sms": false,
        "send_email": false,
        "sms_status": null,
        "email_status": null,
        "shorturl": null,
        "longurl": "https://test.instamojo.com/@thilhanda/091216c655cd47fcb0f89210fd2ce2ae",
        "redirect_url": "http://localhost:4000/api/pay/callback?id=6427fdae3d53d24e1f247193",
        "webhook": "https://codepadapp.netlify.app/",
        "allow_repeated_payments": false,
        "created_at": "2023-04-01T11:22:17.402848Z",
        "modified_at": "2023-04-01T11:22:17.402874Z"
    }
}
      */
      response = JSON.parse(response);
      var resObj = {
        payment_id: response.payment_request.id,
        phone: response.payment_request.phone,
        email: response.payment_request.email,
        buyer_name: response.payment_request.buyer_name,
        amount: response.payment_request.amount,
        purpose: response.payment_request.purpose,
        expires_at: response.payment_request.expires_at,
        status: response.payment_request.status,
        send_sms: response.payment_request.send_sms,
        send_email: response.payment_request.send_email,
        sms_status: response.payment_request.sms_status,
        email_status: response.payment_request.email_status,
        shorturl: response.payment_request.shorturl,
        longurl: response.payment_request.longurl,
        redirect_url: response.payment_request.redirect_url,
        webhook: response.payment_request.webhook,
        allow_repeated_payments:
          response.payment_request.allow_repeated_payments,
        created_at: response.payment_request.created_at,
        modified_at: response.payment_request.modified_at,
      };

      var _id = response.payment_request.redirect_url.split("=")[1];

      Invoice.findOneAndUpdate({ _id: _id }, resObj).then((data) => {
        res.status(200).send({
          success: true,
          payment_url: response.payment_request.longurl,
        });
      });
    }
  });
});

apiRouter.route("/callback").get((req, res, next) => {
  /* http://localhost:4000/api/pay/callback?
    id=642820996c35daf3b8d7d915&
    payment_id=MOJO3401T05A52992287&
    payment_status=Credit&
    payment_request_id=0708c313f1e34738b721525fdb67fab9 */
  console.log("payInvoiceCallback");
  var resObj = {
    payment_id: req.query.payment_id,
    status: req.query.payment_status,
    payment_request_id: req.query.payment_request_id,
  };

  Invoice.findOneAndUpdate({ _id: req.query.id }, resObj)
    .then((data) => {
      if (req.query.payment_status != "Failed") {
        res.status(200).send({
          success: true,
          message: "Payment Success",
        });
      } else {
        res.status(200).send({
          success: false,
          message: "Payment Failed",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

apiRouter.route("/webhook").post((req, res, next) => {
  console.log("WebHook");
  /*
  {
    payment_id: 'MOJO3401O05A52992310',
    status: 'Credit',
    shorturl: '',
    longurl: 'https://test.instamojo.com/@thilhanda/cda4fe70cf28447898ca245300df5b7c',
    purpose: 'Product 5',
    amount: '100.00',
    fees: '1.90',
    currency: 'INR',
    buyer: 'ankit@gmail.com',
    buyer_name: 'ankit039',
    buyer_phone: '+918579961909',
    payment_request_id: 'cda4fe70cf28447898ca245300df5b7c',
    mac: 'edcf600beb70655970647faad970b368f92abaf3'
  }
  */

  Invoice.updateOne(
    { payment_id: req.body.payment_id },
    {
      $set: {
        payment_id: req.body.payment_id,
        status: req.body.status,
        shorturl: req.body.shorturl,
        longurl: req.body.longurl,
        purpose: req.body.purpose,
        amount: req.body.amount,
        fees: req.body.fees,
        currency: req.body.currency,
        buyer: req.body.buyer,
        buyer_name: req.body.buyer_name,
        buyer_phone: req.body.buyer_phone,
        payment_request_id: req.body.payment_request_id,
        mac: req.body.mac,
      }
    }
  ).exec()
    .then((data) => {
      console.log(data)
      console.log(
        "Payment ID-> ",
        req.body.payment_id,
        " Updated-> Sucess Status-> ",
        req.body.status
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = apiRouter;
