import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import fetchListings from "./context/listings";
import { ChakraProvider } from "@chakra-ui/react";
import { BuyerProvider } from "./context/buyerProvider";
import { SellerProvider } from "./context/sellerProvider";
import { AdminProvider } from "./context/adminProvider";
import { theme } from "./components/floatingLabel";

import Login from "./pages/login";
import AdminLogin from "./pages/adminLogin";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

import SellerHomepage from "./pages/sellerHomePage";
import BuyerHomepage from "./pages/buyerHomepage";
import AdminHomepage from "./pages/adminHomepage";

import BuyerListingPage from "./pages/buyerListingPage";
import BuyerProfile from "./pages/buyerProfile";
import BuyerViewOrder from "./pages/buyerViewOrder";

import SellerOrderMgmt from "./pages/sellerOrderMgmt";
import SellerProfile from "./pages/sellerProfile"
import SellerViewOrder from "./pages/sellerViewOrder";
import SellerViewOrderByListing from "./pages/sellerViewOrderByListing";
import SellerListingPage from "./pages/sellerListing";


function App() {


   return (
    <ChakraProvider theme={theme}>
      <BuyerProvider>
        <SellerProvider>
          <AdminProvider>
            <Router>
              <Routes>
                <Route path="/" element={<BuyerHomepage />} />
                <Route path="listing/:id" element={<BuyerListingPage />} />
                <Route path="buyerProfile/:id" element={<BuyerProfile />} />
                <Route path="buyerOrder/:id" element={<BuyerViewOrder />} />
                <Route path="/login" element={<Login />} />
                <Route path="/adminLogin" element={<AdminLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/adminHomepage" element={<AdminHomepage />} />

                <Route path="/sellerHomepage" element={<SellerHomepage />} />
                <Route path="/sellerProfile" element={<SellerProfile/>}/>
                <Route path="sellerOrder/:id" element={<SellerViewOrder/>}/>
                <Route path="/sellerOrderMgmt" element={<SellerOrderMgmt/>}/>
                <Route path="/sellerOrderMgmt/listing/:id" element={<SellerViewOrderByListing/>}/>
                <Route path="/sellerListing/:id" element={<SellerListingPage/>}/>
              </Routes>
            </Router>
          </AdminProvider>
        </SellerProvider>
      </BuyerProvider>
    </ChakraProvider>
  );
}

export default App;
