import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./components/floatingLabel";

import Login from "./pages/login";
import AdminLogin from "./pages/adminLogin";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

import BuyerHomepage from "./pages/buyerHomepage";
import AdminProfilePage from "./pages/adminProfilePage";

import BuyerFollowedShopping from "./pages/buyerFollowedShopping";
import BuyerExploreShopping from "./pages/buyerExploreShopping";
import BuyerSearchSellers from "./pages/buyerSearchSellers";
import BuyerListingPage from "./pages/buyerListingPage";
import BuyerLikedListings from "./pages/buyerLikedListings";
import BuyerProfile from "./pages/buyerProfile";
import BuyerEditAccount from "./pages/buyerEditAccount";
import BuyerViewOrder from "./pages/buyerViewOrder";
import BuyerViewSellerProfile from "./pages/buyerViewSellerProfile";
import MakeReview from "./pages/makeReview";

import ViewAllBuyers from "./pages/viewAllBuyers";
import ViewAllSellers from "./pages/viewAllSellers";
import ViewAllReports from "./pages/viewAllReports";

import SellerOrderMgmt from "./pages/sellerOrderMgmt";
import SellerProfile from "./pages/sellerProfile";
import SellerViewOrder from "./pages/sellerViewOrder";
import SellerViewOrderByListing from "./pages/sellerViewOrderByListing";
import SellerListingPage from "./pages/sellerListing";
import SellerAppointments from "./pages/sellerAppointments";
import SellerEditProfile from "./pages/sellerEditProfile";
import SellerCreateListing from "./pages/sellerCreateListing";
import SellerViewFollowers from "./pages/sellerViewFollowers";

import Forum from "./pages/forum";
import ForumPost from "./pages/forumPost";
import ForumCreatePost from "./pages/forumCreatePost";
import ForumEditPost from "./pages/forumEditPost";

import SellerChangePassword from "./pages/sellerChangePassword";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<BuyerHomepage />} />
          <Route path="/followed" element={<BuyerFollowedShopping />} />
          <Route path="/explore" element={<BuyerExploreShopping />} />
          <Route path="listing/:id" element={<BuyerListingPage />} />
          <Route path="buyerProfile/:id" element={<BuyerProfile />} />
          <Route path="/searchSellers" element={<BuyerSearchSellers />} />
          <Route path="/buyerEditAccount" element={<BuyerEditAccount />} />
          <Route path="buyerOrder/:id" element={<BuyerViewOrder />} />
          <Route
            path="/buyerViewSellerProfile/:id"
            element={<BuyerViewSellerProfile />}
          />
          <Route path="/buyerLikedListings" element={<BuyerLikedListings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/adminProfilePage" element={<AdminProfilePage />} />
          <Route path="/viewAllBuyers" element={<ViewAllBuyers />} />
          <Route path="/viewAllSellers" element={<ViewAllSellers />} />
          <Route path="/viewAllReports" element={<ViewAllReports />} />
          <Route path="/makeReview" element={<MakeReview />} />

          <Route path="/sellerProfile" element={<SellerProfile />} />
          <Route path="/editSellerProfile" element={<SellerEditProfile />} />
          <Route path="sellerOrder/:id" element={<SellerViewOrder />} />
          <Route path="/sellerOrderMgmt" element={<SellerOrderMgmt />} />
          <Route
            path="/sellerOrderMgmt/listing/:id"
            element={<SellerViewOrderByListing />}
          />
          <Route path="/sellerListing/:id" element={<SellerListingPage />} />
          <Route path="/sellerAppointments" element={<SellerAppointments />} />
          <Route
            path="/sellerCreateListing"
            element={<SellerCreateListing />}
          />
          <Route
            path="/sellerViewFollowers"
            element={<SellerViewFollowers />}
          />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/post/:id" element={<ForumPost />} />
          <Route path="/forum/createPost" element={<ForumCreatePost />} />
          <Route path="/forum/editPost/:id" element={<ForumEditPost />} />

          <Route
            path="/sellerChangePassword"
            element={<SellerChangePassword />}
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
