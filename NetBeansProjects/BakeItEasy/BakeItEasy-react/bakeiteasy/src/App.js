import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BuyerLogin from "./screens/buyerLogin";
import SellerLogin from "./screens/sellerLogin";
import SellerHomepage from "./screens/sellerHomePage";
import fetchListings from "./api/listings";
import { ChakraProvider } from "@chakra-ui/react";

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
          <Route path="/sellerHomepage" element={<SellerHomepage />} />

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
