import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BuyerHomepage from "./screens/buyerHomepage";
import BuyerLogin from "./screens/buyerLogin";
import { ChakraProvider } from "@chakra-ui/react";


function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BuyerHomepage />} />
          <Route path="/buyerLogin" element={<BuyerLogin />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

// Fetch listings
const fetchListings = async () => {
  const res = await fetch("http://localhost:8080/listings");
  const data = await res.json();

  return data;
};
