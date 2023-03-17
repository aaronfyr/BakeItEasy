import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import fetchListings from "./api/listings";
import { ChakraProvider } from "@chakra-ui/react";

import BuyerLogin from "./pages/buyerLogin";
import SellerLogin from "./pages/sellerLogin";
import ForgotBuyerPassword from "./pages/forgotBuyerPassword";
import ForgotSellerPassword from "./pages/forgotSellerPassword";
import BuyerSignup from "./pages/buyerSignup";
import SellerSignup from "./pages/sellerSignup";
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
          <Route path="/buyerLogin" element={<BuyerLogin />} />
          <Route path="/sellerLogin" element={<SellerLogin />} />
          <Route path="/forgotBuyerPassword" element={<ForgotBuyerPassword />} />
          <Route path="/forgotSellerPassword" element={<ForgotSellerPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route path="/buyerSignup" element={<BuyerSignup />} />
          <Route path="/sellerSignup" element={<SellerSignup />} />

          <Route path="/sellerHomepage" element={<SellerHomepage />} />

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
