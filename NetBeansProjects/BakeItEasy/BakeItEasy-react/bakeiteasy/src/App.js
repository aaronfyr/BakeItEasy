import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BuyerHomepage from "./screens/buyerHomepage";
import ViewOrder from "./screens/viewOrder";


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<BuyerHomepage/>} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;
