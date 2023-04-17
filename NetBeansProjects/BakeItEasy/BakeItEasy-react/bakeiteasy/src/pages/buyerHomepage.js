import { React, useState } from "react";
import "./resources/default.css";

import { BuyerShopping } from "../components/buyerHomepageShopping";
import { NavigationBar } from "../components/buyerNavigationBar";

import { useNavigate } from "react-router-dom";

function BuyerHomepage() {
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
      <BuyerShopping />
    </div>
  );
}

export default BuyerHomepage;
