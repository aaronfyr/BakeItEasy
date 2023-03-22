import React from "react";
import "./resources/default.css";
import AdminMenuBar from "../components/adminMenuBar";
import Reports from "../components/reports";

function AdminHomepage() {
  return (
    <div className="background">
      <AdminMenuBar />
      <Reports/>
    </div>
  );
}

export default AdminHomepage;
