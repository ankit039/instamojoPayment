// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// function MainComponent() {
// }

// export { MainComponent };

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { api } from "../../config.js";

import "bootstrap/dist/css/bootstrap.min.css";

function HomePageComponent() {
  const [email, setEmail] = React.useState("");

  useEffect(()=>{
   if(localStorage.getItem("instamojo-email")!=null){
    window.location.href = "/invoice";
   }
  },[])

  const loginHandler = (ev) => {
    ev.preventDefault();
    if (!email) {
      return;
    }

    fetch(`${api}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == true) {
          localStorage.setItem("instamojo-email", email);
          window.location.replace("/invoice");
        }else{
            alert(data.data == undefined ? JSON.stringify(data.message) : JSON.stringify(data.data))
        }
      });
  };

  return (
    <Container
      style={{
        marginTop: "20%",
      }}
    >
      <Card
        className="my-1"
        style={{
          width: "20rem",
          margin: "auto",
        }}
      >
        <CardBody>
          <Form onSubmit={loginHandler}>
            <FormGroup className="pb-2 mr-sm-2 mb-sm-0">
              <Label for="email" className="mr-sm-2">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="E-Mail"
                onChange={(ev) => setEmail(ev.currentTarget.value)}
              />
            </FormGroup>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}

export { HomePageComponent };
