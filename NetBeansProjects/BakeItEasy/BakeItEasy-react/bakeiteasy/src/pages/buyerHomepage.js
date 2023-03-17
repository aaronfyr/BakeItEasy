import React from "react";
import "./resources/default.css";

import { NavigationBar } from "../components/buyerNavigationBar";
import { SearchBar } from "../components/searchBar";

function BuyerHomepage() {
  return (
    <div className="background">
      <NavigationBar />
      <h4 className="search">Search for baked goods:</h4>
      <SearchBar />
    </div>
  );
}

export default BuyerHomepage;
