import { React, useEffect, useState } from "react";
import "./resources/default.css";
import OrderSearch from "./searchBarSection.js";
import {
  BrowserRouter as Router,
  useNavigate, // Be sure to add this import
} from "react-router-dom";

function SellerOrderMgmt() {
  return (
    <div>
        <OrderSearch/>
    </div>

  );
}

export default SellerOrderMgmt;
