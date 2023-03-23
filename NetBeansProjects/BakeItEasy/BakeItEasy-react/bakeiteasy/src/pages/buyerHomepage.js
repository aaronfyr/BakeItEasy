import React from "react";
import "./resources/default.css";

import { NavigationBar } from "../components/buyerNavigationBar";
import { BuyerShopping } from "../components/buyerHomepageShopping";

function BuyerHomepage() {
  return (
    <div className="background">
      <NavigationBar />
      <h4 className="search">Search for baked goods:</h4>
      <BuyerShopping />
    </div>
  );
}

export default BuyerHomepage;
