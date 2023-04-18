import { React } from "react";
import { useLocation } from "react-router-dom";
import "./resources/default.css";
import AdminViewSellerViewListingList from "./adminViewSellerViewListingList";

function AdminViewSellerOrderMgmt() {
  const sellerId = new URLSearchParams(useLocation().search).get("id");

  return (
    <div>
      <AdminViewSellerViewListingList sellerId={sellerId} />
    </div>
  );
}

export default AdminViewSellerOrderMgmt;
