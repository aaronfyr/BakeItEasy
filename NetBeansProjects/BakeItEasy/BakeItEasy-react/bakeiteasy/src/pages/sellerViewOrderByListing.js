import { color } from "framer-motion";
import React, { useState, useEffect } from "react";
import "./resources/sellerVOBL.css";
import SellerOrderCard from "./sellerOrderCard.js";
import { NavigationBar } from "../components/buyerNavigationBar";
import { FaCheck } from "react-icons/fa";
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

const SellerViewOrderByListing = () => {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [listing, setListing] = useState([]);

  const { id } = useParams();

  const filteredOrders = orders.filter((order) => {
    if (
      /*(product.tags.toLowerCase().includes(search) ||
      product.title.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.buyerName.toLowerCase().includes(search) ||
      product.notes.toLowerCase().includes(search))*/ true
      // cant get the frickin filter to work
    ) {
      return order;
    }
  });

  //get orders of seller
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/1/orders`,
      {
        //get seller id from storage
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setOrders(data));
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
      .then((data) => setListing(data));
  }, []);

  let navigate = useNavigate();
  const routeChangeToOrder = (id) => {
    let path = "/sellerOrder/";
    /*<Link to={{
    pathname: "path",
    state: products.filter((product) => {if (product.id === id) {return product}}) // your data array of objects
    }}>
    </Link> */
    navigate(path + id);
  };

  return (
    <div>
      <div className="dropdownRow">
        <div className="heading">
          <h1 style={{ fontWeight: "bolder", fontSize: 20 }}>My Orders</h1>
        </div>
      </div>
      <div className="searchBarSection">
        <div class="searchBar">
          <input
            className="input"
            onChange={(e) => {
              setSearch(e.target.value.toLowerCase());
            }}
          />
          <button className="button">
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
            <div className="cardTextBlock" style={{ width: 1000 }}>
              <h2>{listing.name}</h2>
            </div>
            <div className="sellerOrderCardBodyFlex">
              <div className="sellerOrderCardBodyFlex">
                <img
                  alt="cake"
                  style={imgStyle}
                  src={""} /*listing.imagePaths[0]*/
                />
              </div>

              <div
                style={{ width: 500, marginLeft: 20 }}
                className="cardTextBlock"
              >
                <h1>CATEGORY: {listing.listingCategory}</h1>
                <br></br>
                <h1>DESCRIPTION:</h1>
                <body>{listing.description}</body>
                <h1>PRICE:</h1>
                <body>${listing.price}</body>
              </div>
            </div>
          </SellerOrderCard>
        </div>

        <div className="orderDisplay">
          {filteredOrders.map((order) => (
            <div
              className="orderComponent"
              onClick={() => routeChangeToOrder(order.orderId)}
            >
              <SellerOrderCard>
                <div className="sellerOrderCardHeader">
                  <img
                    style={pfpStyle}
                    alt="profile pic"
                    width="50"
                    src="https://st.depositphotos.com/1597387/1984/i/950/depositphotos_19841901-stock-photo-asian-young-business-man-close.jpg"
                  ></img>
                  <h3>{order.id}</h3>
                </div>
                <div className="sellerOrderCardBodyFlex">
                  <div className="sellerOrderCardBodyFlex"></div>

                  <div
                    style={{ width: 350, margin: 5 }}
                    className="cardTextBlock"
                  >
                    <h4>note: {order.description}</h4>
                    <h4>amount due: {order.price}</h4>
                    <h4>date due: {order.dateOfCollection}</h4>
                  </div>

                  <div className="orderStatus">
                    <h2>{order.orderStatus}</h2>
                  </div>
                </div>
                <div className="sellerOrderCardBodyFlex">
                  <div className="searchBarButton1">
                    <h5>click to view order</h5>
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

const data = [
  {
    id: 1,
    buyerName: "chocLover123",
    title: "Chocolate cake",
    category: "Cake",
    price: "175.4",
    tags: "coat check textured camel brown long sleeves buttoned cuffs",
    url: "https://www.recipetineats.com/wp-content/uploads/2018/03/Chocolate-Cake_9-SQ.jpg?w=500&h=500&crop=1",
    notes: "no eggs",
    status: "accepted",
  },
  {
    id: 2,
    buyerName: "janeTan",
    title: "Strawberry Pie",
    category: "Pastry",
    price: "155.4",
    tags: "coat camel black grey marl lapel collar hip flap pockets",
    url: "https://therecipecritic.com/wp-content/uploads/2019/06/freshstrawberrypie_hero.jpg",
    notes: "deliver to my address",
    status: "accepted",
  },
  {
    id: 3,
    buyerName: "johnDoe",
    title: "Lasagna",
    category: "Savoury",
    price: "125.4",
    tags: "coat camel white short sleeves double-breasted button",
    url: "https://www.thewholesomedish.com/wp-content/uploads/2018/07/Best-Lasagna-550-500x375.jpg",
    notes: "use chicken instead of beef",
    status: "accepted",
  },
  {
    id: 4,
    buyerName: "BakerBoy567",
    title: "Cupcakes",
    category: "Cake",
    price: "55.4",
    tags: "hoodie solid plain purple long baggy hood",
    url: "https://www.bhg.com/thmb/iL-5Q6gGjmXkxCKqEovughTLQAo=/3000x0/filters:no_upscale():strip_icc()/how-to-bake-how-to-make-cupcakes-hero-01-12c03f3eff374d569b0565bff7d9e597.jpg",
    notes: "separate into boxes of 5",
    status: "accepted",
  },
  {
    id: 5,
    buyerName: "breadBro",
    title: "Sourdough Loaf",
    category: "Bread",
    price: "55.4",
    tags: "hoodie solid plain black long baggy hood",
    url: "https://www.kingarthurbaking.com/sites/default/files/2021-07/Rustic-Sourdough-Loaf_0049__0.jpg",
    notes: "nil",
    status: "accepted",
  },
  {
    id: 6,
    buyerName: "jellycat987",
    title: "Jelly Cake",
    category: "Desserts",
    price: "55.4",
    tags: "hoodie solid plain gray grey short hood",
    url: "https://img.taste.com.au/gym_Wtb0/taste/2022/10/singapore-sling-jelly-cake-181810-1.png",
    notes: "use red jelly",
    status: "accepted",
  },
];

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

export default SellerViewOrderByListing;
