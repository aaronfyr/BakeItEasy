import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import fetchListings from "./api/listings";
import { ChakraProvider } from "@chakra-ui/react";

import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

import SellerHomepage from "./pages/sellerHomePage";
import BuyerHomepage from "./pages/buyerHomepage";
import BuyerListingPage from "./pages/buyerListingPage";



function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BuyerHomepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />


          <Route path="/sellerHomepage" element={<SellerHomepage />} />

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
