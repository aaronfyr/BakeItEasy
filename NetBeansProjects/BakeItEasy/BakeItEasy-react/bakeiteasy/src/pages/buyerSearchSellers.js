import { React, useState } from "react";
import "./resources/default.css";

import { NavigationBar } from "../components/buyerNavigationBar";
import { BuyerViewOfSellers } from "../components/buyerViewOfSellers";

import { HStack } from "@chakra-ui/react";
import { FaMitten } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function BuyerSearchSellers() {
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
    <div>
      <NavigationBar />
      <br />
      <div class="shoppingHeader">
        <HStack spacing="10px">
          <FaMitten color="#c75f4a" />
          <h1>Bakers</h1>
        </HStack>
      </div>
      <h4 className="search">Search for seller:</h4>
      <BuyerViewOfSellers />
    </div>
  );
}

export default BuyerSearchSellers;
