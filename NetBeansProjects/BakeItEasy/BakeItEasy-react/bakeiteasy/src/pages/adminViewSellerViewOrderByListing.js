import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMenuBar from "../components/adminMenuBar.js";
import { formatDate, formatPrice } from "../components/formatter.js";
import getOrderBuyer from "../components/getOrderBuyer.js";
import "./resources/sellerVOBL.css";
import SellerOrderCard from "./sellerOrderCard.js";

const AdminViewSellerViewOrderByListing = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [listing, setListing] = useState([]);
  const { id } = useParams();

  const filteredOrders = orders.filter((order) => {
    if (
      (order && order.description.toLowerCase().includes(search)) ||
      (order && order.orderStatus.toLowerCase().includes(search)) ||
      (order && order.address.toLowerCase().includes(search))
      // cant get the frickin filter to work
    ) {
      return order;
    }
  });

  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${id}/orders`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      });
  }, []);

  //get listing
  useEffect(() => {
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListing(data);
      });
  }, []);

  let navigate = useNavigate();
  const routeChangeToOrder = (id) => {
    let path = "/adminViewSellerViewOrder/";
    /*<Link to={{
    pathname: "path",
    state: products.filter((product) => {if (product.id === id) {return product}}) // your data array of objects
    }}>
    </Link> */
    navigate(path + id);
  };

  return (
    <div>
      <AdminMenuBar />
      <div className="dropdownRow">
        <div className="heading"></div>
      </div>
      <div className="searchBarSection">
        <div class="searchBar">
          <input
            className="inputMyOrdersSearch"
            onChange={(e) => {
              setSearch(e.target.value.toLowerCase());
            }}
          />
          <button className="myOrdersSearchIcon">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>
        <div className="orderDisplay">
          <SellerOrderCard>
            <div className="cardTextBlock" style={{ width: 1000 }}></div>
            <h1>{listing.name}</h1>
            <div className="sellerOrderCardBodyFlex">
              <div className="sellerOrderCardBodyFlex">
                <img
                  alt="cake"
                  style={imgStyle}
                  src={
                    listing.imagePaths
                      ? listing.imagePaths[0]
                      : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80"
                  }
                />
              </div>

              <div
                style={{ width: 500, marginLeft: 20 }}
                className="cardTextBlock"
              >
                <br></br>
                <br></br>
                <Flex>
                  <h2>Category:</h2>
                  {!listing.listingCategory && (
                    <div className="listDetails">{listing.listingCategory}</div>
                  )}
                  {listing.listingCategory && (
                    <div className="listDetails">
                      {listing.listingCategory.toLowerCase()}
                    </div>
                  )}
                </Flex>
                <Flex>
                  <h2>Description:</h2>
                  <div className="listDetails">{listing.description}</div>
                </Flex>
                <Flex>
                  <h2>Price:</h2>
                  <div className="listDetails">
                    ${formatPrice(listing.price)}
                  </div>
                </Flex>
                <Flex>
                  <h2>Max Quantity:</h2>
                  <div className="listDetails">{listing.maxQuantity}</div>
                </Flex>
                <Flex>
                  <h2>Preparation Days Needed:</h2>
                  <div className="listDetails">{listing.minPrepDays}</div>
                </Flex>
              </div>
            </div>
          </SellerOrderCard>
        </div>

        <div className="orderDisplay">
          {filteredOrders.map((order) => (
            <div className="orderComp">
              <SellerOrderCard>
                <div className="sellerOrderCardHeader">
                  <h1>Order ID #{order.orderId}</h1>
                </div>
                <div className="sellerOrderCardBodyFlex">
                  <div className="sellerOrderCardBodyFlex"></div>

                  <div
                    style={{ width: 350, margin: 5 }}
                    className="cardTextBlock"
                  >
                    <h4>Note: {order.description}</h4>
                    <h4>Amount due: ${formatPrice(order.price)}</h4>
                    <h4>Date due: {formatDate(order.dateOfCollection)}</h4>
                  </div>

                  <div className="orderStatus">
                    <h2>{order.orderStatus}</h2>
                  </div>
                </div>
                <div className="sellerOrderCardBodyFlex">
                  <div
                    className="searchBarButton1"
                    onClick={() => routeChangeToOrder(order.orderId)}
                  >
                    <h5>Click to view order</h5>
                  </div>
                </div>
              </SellerOrderCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const pfpStyle = {
  padding: 0.5,
  borderRadius: "50%",
  width: 30,
  height: 30,
  objectFit: "cover",
  background: "grey",
  display: "block",
};

const imgStyle = {
  height: 250,
  width: 350,
  objectFit: "cover",
  borderRadius: 10,
};

export default AdminViewSellerViewOrderByListing;
