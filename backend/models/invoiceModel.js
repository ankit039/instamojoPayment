const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Create Schema
 * Create a new instance of Invoice model and set the values of the properties(fields)
 */
const InvoiceSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Unpaid",
    },
    redirect_url: {
      type: String,
      default: "",
    },
    buyer: {
      type: String,
      default: "",
    },
    buyer_name: {
      type: String,
      default: "",
    },
    buyer_phone: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    fees: {
      type: String,
      default: "",
    },
    longurl: {
      type: String,
      default: "",
    },
    mac: {
      type: String,
      default: "",
    },
    payment_id: {
      type: String,
      default: "",
    },
    payment_request_id: {
      type: String,
      default: "",
    },
    shorturl: {
      type: String,
      default: "",
    },
    expires_at: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Invoice = mongoose.model("invoice", InvoiceSchema);
