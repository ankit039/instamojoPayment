import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { api } from "../../config.js";
import {
  Container,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Badge,
  Row,
  Col,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function InvoicePageComponent() {
  var loadOnce = false;
  const [invoiceData, setInvoiceData] = React.useState([]);

  //fetch all invoice assoiciated with email
  useEffect(() => {
    fetch(`${api}/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: localStorage.getItem("instamojo-email"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == true) {
          loadOnce = true;
          setInvoiceData(data.data);
        }
      });
  }, [loadOnce]);

  //handle CTA clicks on Invoice Page
  const handlePayInvoice = (invoiceData) => {
    console.log(invoiceData);
    invoiceData.redirect_url = api + `/pay/callback?id=${invoiceData._id}`;
    invoiceData.webhook_url = api + `/pay/webhook?id=${invoiceData._id}`;
    invoiceData.buyer_name = invoiceData.username;
    console.log(invoiceData);

    fetch(`${api}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == true) {
          console.log(data);
          window.location.href = data.payment_url;
        }
      });
  };

  return (
    <>
      <Row className="row-cols-lg-auto g-3 align-items-center">
        <Label sm={2}>
          <b>Logged In Detail</b>
        </Label>
        <Label for="email" sm={2}>
          E-Mail
        </Label>
        <Col sm={10}>
          <Input
            id="email"
            name="email"
            placeholder={localStorage.getItem("instamojo-email")}
            onChange={(ev) =>
              localStorage.setItem("instamojo-email", ev.currentTarget.value)
            }
          />
        </Col>
        <Button color="primary" onClick={() => window.location.reload()}>
          Submit
        </Button>
      </Row>

      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Invoice ID</th>
            <th>Payment ID</th>
            <th>Payment Request ID</th>
            <th>Purpose</th>
            <th>Amount</th>
            <th>Fees</th>
            <th>Currency</th>
            <th>Status</th>
            <th>CTA</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.map((data, index) => (
            <tr>
              <th scope="row">{index}</th>
              <td>{data._id}</td>
              <td>{data.payment_id}</td>
              <td>{data.payment_request_id}</td>
              <td>{data.purpose}</td>
              <td>{data.amount}</td>
              <td>{data.fees}</td>
              <td>{data.currency}</td>
              <td>{data.status}</td>
              <td>
                {data.status == "Unpaid" || data.status == "Failed" ? (
                  <Button color="danger" onClick={() => handlePayInvoice(data)}>
                    Pay Now
                  </Button>
                ) : data.status == "Pending" ? (
                  <Button color="primary" onClick={() => handlePayInvoice(data)}>
                    Try Again
                  </Button>
                ) : data.status == "Credit" ? (
                  <Button color="success" disabled>
                    Paid
                  </Button>
                ) : (
                  <></>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export { InvoicePageComponent };
