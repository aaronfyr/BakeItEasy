import { React, useEffect, useState } from "react";
import "./resources/default.css";

import { NavigationBar } from "../components/buyerNavigationBar";
import { BuyerShopping } from "../components/buyerHomepageShopping";

import {
  BrowserRouter as Router,
  useNavigate, // Be sure to add this import
} from "react-router-dom";

import { Button } from "@chakra-ui/react";

function BuyerProfile() {
  const [seller, setSeller] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const navigate = useNavigate();

  // if user is not logged in, redirects to homepage
  /*
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.type === "seller") {
        setSeller(parsedUser);
      } else {
        setBuyer(parsedUser);
      }
    } else {
      navigate("/login");
    }
  }, []);
  */

  return (
    <div className="background">
      <NavigationBar />
      <Button>Orders</Button>
    </div>
  );
}

export default BuyerProfile;