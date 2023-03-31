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
import AdminProfilePage from "./pages/adminProfilePage";

import BuyerListingPage from "./pages/buyerListingPage";
import BuyerProfile from "./pages/buyerProfile";
import BuyerViewOrder from "./pages/buyerViewOrder";
import MakeReview from "./pages/makeReview";

import ViewAllBuyers from "./pages/viewAllBuyers";
import ViewAllSellers from "./pages/viewAllSellers";
import ViewAllReports from "./pages/viewAllReports";

import SellerOrderMgmt from "./pages/sellerOrderMgmt";
import SellerProfile from "./pages/sellerProfile"
import SellerViewOrder from "./pages/sellerViewOrder";


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
                <Route
                  path="/adminProfilePage"
                  element={<AdminProfilePage />}
                />
                <Route path="/viewAllBuyers" element={<ViewAllBuyers />} />
                <Route path="/viewAllSellers" element={<ViewAllSellers />} />
                <Route path="/viewAllReports" element={<ViewAllReports />} />
                <Route path="/makeReview" element={<MakeReview />} />

                <Route path="/sellerHomepage" element={<SellerHomepage />} />
                <Route path="/sellerProfile" element={<SellerProfile/>}/>
                <Route path="/sellerViewOrder" element={<SellerViewOrder/>}/>
                <Route path="/sellerOrderMgmt" element={<SellerOrderMgmt/>}/>
              </Routes>
            </Router>
          </AdminProvider>
        </SellerProvider>
      </BuyerProvider>
    </ChakraProvider>
  );
}

export default App;
