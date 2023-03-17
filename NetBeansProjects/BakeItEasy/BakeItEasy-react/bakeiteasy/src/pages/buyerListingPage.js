import React from "react";
import { useParams } from "react-router-dom";

import "./resources/default.css";

import { NavigationBar } from "../components/buyerNavigationBar";

function BuyerListingPage() {
  const { id } = useParams();
  return (
    <div className="background">
      <NavigationBar />
      <h4 className="search">{id}</h4>
    </div>
  );
}

export default BuyerListingPage;
