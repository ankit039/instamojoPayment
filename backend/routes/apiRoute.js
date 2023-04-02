const express = require("express");
var bodyParser = require("body-parser");

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

// Import all API dependency
const createInvoice = require("./createInvoice");
const payInvoice = require("./payInvoice");
const getInvoice = require("./getInvoice");
const signup = require("./signup");
const login = require("./login");

// Initialize API route 
apiRouter.use("/create", createInvoice);
apiRouter.use("/pay", payInvoice);
apiRouter.use("/get", getInvoice);
apiRouter.use("/singup", signup);
apiRouter.use("/login", login);

module.exports = apiRouter;