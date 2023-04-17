import { React, useEffect, useState } from "react";
import "./resources/profile.css";

import { SellerCalendar } from "../components/sellerCalendar.js";
import { SellerNavigationBar } from "../components/sellerNavigationBar";

import { useNavigate } from "react-router-dom";

import { HStack, Spacer } from "@chakra-ui/react";
import "reactjs-popup/dist/index.css";

function SellerAppointments() {
  const navigate = useNavigate();

  // Fetch this seller details
  const [seller, setSeller] = useState(null);
  const [sellerName, setSellerName] = useState("Log In");
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      if (!fetchedSeller) {
        console.log("navbar", "no seller");
        navigate("/login");
      } else {
        console.log("navbar", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSeller(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.name: ", parsedUser.name);
          setSellerName(parsedUser.name);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
          console.log("seller ", sellerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <SellerNavigationBar />
      <br />
      <div className="calendarContainer">
        <HStack>
          <Spacer />
          <h1>Appointments</h1>
          <br />
          <Spacer />
        </HStack>
        <SellerCalendar />
      </div>
    </div>
  );
}

export default SellerAppointments;
