import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "./resources/searchBar.css";

import { FiHeart } from "react-icons/fi";

export const SearchBar = () => {
  const [categories, setCategories] = useState([
    { name: "Cakes" },
    { name: "Cupcakes" },
    { name: "Bread" },
    { name: "CNY" },
    { name: "Pies" },
    { name: "Tarts" },
    { name: "Christmas" },
    { name: "Birthday" },
    { name: "Wedding" },
    { name: "Graduation" },
    { name: "Cookies" },
    { name: "Halal" },
    { name: "Fried" },
    { name: "Fruits" },
    { name: "Unique" },
    { name: "Christmas" },
    { name: "Birthday" },
    { name: "Wedding" },
    { name: "Graduation" },
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Strawberry Shortcake",
      category: "Cake",
      price: "60",
      tags: "coat check textured camel brown long sleeves buttoned cuffs",
      image: "./cakeImage.jpeg",
    },
    {
      id: 2,
      title: "Chicken Puff (set of 20)",
      category: "Pastry",
      price: "85",
      tags: "coat camel black grey marl lapel collar hip flap pockets",
    },
    {
      id: 3,
      title: "Beef Casserole",
      category: "Savoury",
      price: "70",
      tags: "coat camel white short sleeves double-breasted button",
    },
    {
      id: 4,
      title: "Blueberry Pie",
      category: "Pie",
      price: "55.4",
      tags: "hoodie solid plain purple long baggy hood",
    },
    {
      id: 5,
      title: "Brownie box (set of 10)",
      category: "Brownies",
      price: "55.4",
      tags: "hoodie solid plain black long baggy hood",
    },
    {
      id: 6,
      title: "Strawberry Shortcake",
      category: "Cake",
      price: "60",
      tags: "coat check textured camel brown long sleeves buttoned cuffs",
      image: "./cakeImage.jpeg",
    },
    {
      id: 7,
      title: "Chicken Puff (set of 20)",
      category: "Pastry",
      price: "85",
      tags: "coat camel black grey marl lapel collar hip flap pockets",
    },
    {
      id: 8,
      title: "Beef Casserole",
      category: "Savoury",
      price: "70",
      tags: "coat camel white short sleeves double-breasted button",
    },
    {
      id: 9,
      title: "Blueberry Pie",
      category: "Pie",
      price: "55.4",
      tags: "hoodie solid plain purple long baggy hood",
    },
    {
      id: 10,
      title: "Brownie box (set of 10)",
      category: "Brownies",
      price: "55.4",
      tags: "hoodie solid plain black long baggy hood",
    },
    {
      id: 11,
      title: "Strawberry Shortcake",
      category: "Cake",
      price: "60",
      tags: "coat check textured camel brown long sleeves buttoned cuffs",
      image: "./cakeImage.jpeg",
    },
    {
      id: 12,
      title: "Chicken Puff (set of 20)",
      category: "Pastry",
      price: "85",
      tags: "coat camel black grey marl lapel collar hip flap pockets",
    },
    {
      id: 13,
      title: "Beef Casserole",
      category: "Savoury",
      price: "70",
      tags: "coat camel white short sleeves double-breasted button",
    },
    {
      id: 14,
      title: "Blueberry Pie",
      category: "Pie",
      price: "55.4",
      tags: "hoodie solid plain purple long baggy hood",
    },
    {
      id: 15,
      title: "Brownie box (set of 10)",
      category: "Brownies",
      price: "55.4",
      tags: "hoodie solid plain black long baggy hood",
    },
    {
      id: 16,
      title: "Strawberry Shortcake",
      category: "Cake",
      price: "60",
      tags: "coat check textured camel brown long sleeves buttoned cuffs",
      image: "./cakeImage.jpeg",
    },
    {
      id: 17,
      title: "Chicken Puff (set of 20)",
      category: "Pastry",
      price: "85",
      tags: "coat camel black grey marl lapel collar hip flap pockets",
    },
    {
      id: 18,
      title: "Beef Casserole",
      category: "Savoury",
      price: "70",
      tags: "coat camel white short sleeves double-breasted button",
    },
    {
      id: 19,
      title: "Blueberry Pie",
      category: "Pie",
      price: "55.4",
      tags: "hoodie solid plain purple long baggy hood",
    },
    {
      id: 20,
      title: "Brownie box (set of 10)",
      category: "Brownies",
      price: "55.4",
      tags: "hoodie solid plain black long baggy hood",
    },
  ]);

  let navigate = useNavigate();
  const routeChangeToListing = (id) => {
    let path = "listing/";
    navigate(path + id);
  };

  /*
  <li key={product.id}>
    <Link to={`listing/${product.id}`}>Click here</Link>
  </li>;
  */

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    if (
      product.tags.toLowerCase().includes(search) ||
      product.title.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    ) {
      return product;
    }
    return null;
  });

  return (
    <div>
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
      <h4 className="search">Shop by Category:</h4>

      <div class="categoriesContainer">
        <div className="categoriesDisplay">
          {categories.map((category) => (
            <div className="category">{category.name}</div>
          ))}
        </div>
      </div>

      <div class="shoppingHeader">Followed Bakers</div>

      <div className="display">
        {filteredProducts.map((product) => (
          <div
            className="product"
            onClick={() => routeChangeToListing(product.id)}
          >
            <div class="productSeller">
              <img
                width="30px"
                height="30px"
                src={require("../assets/dummyuser.png")}
                alt="listing product"
              />
              <h6>seller name</h6>
            </div>
            <div className="productImg">
              <img
                className="productImg"
                src={require("../assets/scones.jpg")}
                alt="listing product"
              />
            </div>
            <h3>{product.title}</h3>
            <h5>product details</h5>
            <div class="productBottomRow">
              <FiHeart size="1.2rem" />
              <h3>${product.price}</h3>
            </div>
          </div>
        ))}
      </div>

      <div class="shoppingHeader">Explore More Bakers</div>
      <div className="display">
        {filteredProducts.map((product) => (
          <div
            className="product"
            onClick={() => routeChangeToListing(product.id)}
          >
            <div class="productSeller">
              <img
                width="30px"
                height="30px"
                src={require("../assets/dummyuser.png")}
                alt="listing product"
              />
              <h6>seller name</h6>
            </div>
            <div className="productImg">
              <img
                className="productImg"
                src={require("../assets/scones.jpg")}
                alt="listing product"
              />
            </div>
            <h3>{product.title}</h3>
            <h5>product details</h5>
            <div class="productBottomRow">
              <FiHeart size="1.2rem" />
              <h3>${product.price}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
