import { color } from "framer-motion";
import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import "./resources/forum.css";
import SellerOrderCard from "./sellerOrderCard.js";
import CategoryDropdown from "../components/categoryDropdown";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import { NavigationBar } from "../components/buyerNavigationBar";
import { FaComments } from "react-icons/fa";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  HStack,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";
import { FiHeart, FiGlobe, FiUsers, FiPlus } from "react-icons/fi";
import ReactLoading from "react-loading";
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";
import Post from "../components/post";

const Forum = () => {
  let navigate = useNavigate();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [buyerId, setBuyerId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState([]);

  const [category, setCategory] = useState("");

  // fetch current buyer/seller
  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      const fetchedBuyer = localStorage.getItem("buyer");

      if (!fetchedBuyer && !fetchedSeller) {
        navigate("/login");
      }
      if (!fetchedSeller) {
        console.log("forum", "is buyer");
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          console.log("parsedUser.id: ", parsedUser.buyerId);
          setBuyerId(parsedUser.buyerId);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("forum", "is seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  function getCategoryUrl(category) {
    switch (category) {
      case "DISCUSSION":
        return "https://cdn-icons-png.flaticon.com/512/8286/8286038.png";
      case "QUESTION":
        return "https://cdn-icons-png.flaticon.com/512/4595/4595213.png";
      case "LOOKINGFOR":
        return "https://cdn-icons-png.flaticon.com/512/3101/3101467.png";
      case "SHARINGINGREDIENTS":
        return "https://cdn-icons-png.flaticon.com/512/3038/3038135.png";
      case "RECIPES":
        return "https://cdn-icons-png.flaticon.com/512/2253/2253457.png";
      default:
        return "";
    }
  }

  //get posts
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/posts`,
          {
            //get all posts endpoint not ready yet
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.ok) {
        }
        setPosts(data);

        //delete later
        console.log("post ID is" + data.postId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // handleSearch
  const [search, setSearch] = useState("");
  const handleSearch = (event) => {
    console.log("search: ", search);
    event.preventDefault();
    const searchLowerCase = event.target.value.toLowerCase();
    setSearch(searchLowerCase);
  };

  // handle filter by category
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [categories, setCategories] = useState([
    { name: "Discussion" },
    { name: "Question" },
    { name: "Looking For" },
    { name: "Sharing Ingredients" },
    { name: "Recipes" },
  ]);

  const handleFilterByCateory = (categoryName) => {
    const categoryNameLowerCase = categoryName.toLowerCase().replace(/\s/g, "");
    if (categoryFilter === categoryNameLowerCase) {
      // set category status to not selected

      setCategoryFilter(null);
    } else {
      // set category status to selected

      console.log("filter category: ", categoryName);
      setCategoryFilter(categoryName.toLowerCase().replace(/\s/g, ""));
    }
  };

  const routeChangeToPost = (id) => {
    let path = "/forum/post/";
    navigate(path + id);
  };

  const routeChangeToCreatePost = () => {
    let path = "/forum/createPost/";
    navigate(path);
  };

  function getCategoryUrl(category) {
    switch (category.toUpperCase()) {
      case "DISCUSSION":
        return "https://cdn-icons-png.flaticon.com/512/8286/8286038.png";
      case "QUESTION":
        return "https://cdn-icons-png.flaticon.com/512/4595/4595213.png";
      case "LOOKINGFOR":
        return "https://cdn-icons-png.flaticon.com/512/3101/3101467.png";
      case "SHARINGINGREDIENTS":
        return "https://cdn-icons-png.flaticon.com/512/3038/3038135.png";
      case "RECIPES":
        return "https://cdn-icons-png.flaticon.com/512/2253/2253457.png";
      default:
        return "";
    }
  }

  return (
    <div>
      {sellerId && <SellerNavigationBar />}
      {buyerId && <NavigationBar />}
      <ToastContainer />
      <div className="float" onClick={() => routeChangeToCreatePost()}>
        <FiPlus size="2.5rem" />
      </div>
      <div class="shoppingHeader">
        <HStack spacing="10px">
          <FiUsers />
          <h1>All Posts</h1>
        </HStack>
      </div>
      <br />
      <div className="homepageSearchBar">
        <input
          className="homepageInput"
          name="search"
          placeholder="Search for Post..."
          onChange={handleSearch}
          value={search}
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>
      <h4 className="search">Post Categories: </h4>

      <div class="categoriesContainer">
        <div className="homepageCategoriesDisplay">
          {categories.map((category) => (
            <Flex>
              <div
                className="category"
                onClick={() => handleFilterByCateory(category.name)}
              >
                {category.name}
              </div>
            </Flex>
          ))}
        </div>
      </div>
      <div className="postsDisplay">
        {/*change to filtered posts*/}
        {posts
          .filter((post) => {
            if (post.title.toLowerCase().includes(search)) {
              if (
                (categoryFilter &&
                  post.postCategory.toLowerCase().includes(categoryFilter)) ||
                !categoryFilter
              ) {
                return post;
              }
            }
            return null;
          })
          .map((post) => (
            <Post
              postId={post.postId}
              title={post.title}
              dateCreated={post.dateCreated}
              postCategory={post.postCategory}
              isBuyer={post.isBuyer}
              categoryImage={getCategoryUrl(post.postCategory)}
            />

            /*
            <div
              className="postComp"
              onClick={() => routeChangeToOrder(post.postId)}
            >
              <SellerOrderCard>
                <div className="sellerOrderCardHeader"></div>
                <div className="sellerOrderCardBodyFlex">
                  <div
                    className="sellerOrderCardBodyFlex"
                    style={{ width: 70 }}
                  >
                    <img
                      alt="cake"
                      style={imgStyle}
                      src={getCategoryUrl(post.postCategory)}
                    />
                  </div>

                  <div style={{ width: 1100 }} className="ctb">
                    <h2>
                      #ID{post.postId}: {post.title} [by POSTER]
                    </h2>
                    <div className="flexBox">
                      <h4>{post.postCategory}</h4>
                      <div className="viewComments">
                        <FaComments style={{ alignSelf: "center" }} />
                        <h3>view comments</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </SellerOrderCard>
            </div>
            */
          ))}
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
  height: 60,
  width: 60,
  objectFit: "cover",
  borderRadius: 10,
};

export default Forum;
