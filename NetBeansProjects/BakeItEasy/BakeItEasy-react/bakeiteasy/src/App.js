import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BuyerHomepage from "./pages/buyerHomepage";
import BuyerListingPage from "./pages/buyerListingPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<BuyerHomepage />} />
          <Route path="listing/:id" element={<BuyerListingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
