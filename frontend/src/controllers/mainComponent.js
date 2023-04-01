import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePageComponent } from "../controllers/homePage/homePageComponent";
import { InvoicePageComponent } from "../controllers/invoicePage/invoicePageComponent";


function MainComponent() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact={true} component={HomePageComponent} />
          <Route path="/invoice" exact={true} component={InvoicePageComponent} />
        </Switch>
      </Router>
    </>
  );
}

export { MainComponent };
