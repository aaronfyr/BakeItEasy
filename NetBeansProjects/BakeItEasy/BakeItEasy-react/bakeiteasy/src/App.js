import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import fetchListings from "./api/listings";
import { ChakraProvider } from "@chakra-ui/react";
import { BuyerProvider } from "./api/buyerProvider";
import { SellerProvider } from "./api/sellerProvider";
import { AdminProvider } from "./api/adminProvider";
import { theme } from "./components/floatingLabel";

import Login from "./pages/login";
import AdminLogin from "./pages/adminLogin";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

import SellerHomepage from "./pages/sellerHomePage";
import BuyerHomepage from "./pages/buyerHomepage";
import BuyerListingPage from "./pages/buyerListingPage";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BuyerProvider>
        <SellerProvider>
          <AdminProvider>
            <Router>
              <Routes>
                <Route path="/" element={<BuyerHomepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/adminLogin" element={<AdminLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/resetPassword" element={<ResetPassword />} />

                <Route path="/sellerHomepage" element={<SellerHomepage />} />
              </Routes>
            </Router>
          </AdminProvider>
        </SellerProvider>
      </BuyerProvider>
    </ChakraProvider>
  );
}

export default App;
