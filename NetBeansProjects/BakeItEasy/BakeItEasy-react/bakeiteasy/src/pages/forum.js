import { color } from "framer-motion";
import React, {useState, useEffect } from "react";
import "./resources/forum.css";
import SellerOrderCard from "./sellerOrderCard.js";
import CategoryDropdown from "../components/categoryDropdown";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import {NavigationBar } from "../components/buyerNavigationBar";
import {FaComments} from "react-icons/fa";
import {formatPrice} from "../components/formatter"
import {toast, ToastContainer} from "react-toastify";
import {Flex} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";


/*const orderResponse = await fetch(``)*/

const Forum = () => {

  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
    const [buyerId, setBuyerId] = useState(null);
    const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState([]);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      const fetchedBuyer = localStorage.getItem("buyer");

      if (!fetchedBuyer && !fetchedSeller) {
        console.log("navbar", "no buyer or seller");
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
async function fetchPosts() {
  try {
    const response = await fetch(`http://localhost:8080/BakeItEasy-war/webresources/posts`, {
      //get all posts endpoint not ready yet
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.ok) {
    }
    setPosts(data);

    //delete later
    console.log("post ID is" + data.postId);
  } catch (error) {
    console.error(error);
  }

}

function selectCat(categoryString) { // THIS CAUSES too many re-renders
   /* if (category === categoryString) {
        setCategory("");
    } else {
        setCategory(categoryString);
    }*/
}

function filterPosts(posts, search, category) {
  return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(search) ||
        post.postCategory.toLowerCase().includes(search)
      );

  });
}

useEffect(() => {
  fetchPosts();
}, [posts]);


useEffect(() => {
  fetchPosts();
  if (posts.length > 0) {
    const filteredData = filterPosts(posts, search, "");
    setFilteredPosts(filteredData);
  }
}, [posts, search, category]);



   let navigate = useNavigate();
  const routeChangeToOrder = (id) => {
    let path = "post/";
    navigate(path + id);
  };

  return (
    <div>
        {sellerId &&<SellerNavigationBar/> }
        {buyerId &&<NavigationBar/> }
        <ToastContainer/>
        <div className="dropdownRow">
            <div className="heading">
                <h1>Forum</h1>
            </div>
        {/*<CategoryDropdown onCategoryChange={handleCategoryChange}/>
        <body style={{fontFamily: 'Montserrat'}}>Selected category: {selectedCategory}</body>*/}

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

      <Flex>
        <div className="viewComments" onClick={selectCat("DISCUSSION")}>
            <FaComments style={{alignSelf: "center"}}/>
            <div style={{width: 10}}></div>
            <h3>Discussion</h3>
        </div>
        <div className="viewComments" onClick={selectCat("LOOKINGFOR")}>
             <FaComments style={{alignSelf: "center"}}/>
             <div style={{width: 10}}></div>
            <h3>Looking for</h3>
        </div>
        <div className="viewComments" onClick={selectCat("QUESTION")}>
             <FaComments style={{alignSelf: "center"}}/>
             <div style={{width: 10}}></div>
            <h3>Question</h3>
        </div>
        <div className="viewComments" onClick={selectCat("SHAREINGREDIENTS")}>
             <FaComments style={{alignSelf: "center"}}/>
             <div style={{width: 10}}></div>
            <h3>Share Ingredients</h3>
        </div>
        <div className="viewComments" onClick={selectCat("RECIPES")}>
             <FaComments style={{alignSelf: "center"}}/>
             <div style={{width: 10}}></div>
            <h3>Recipes</h3>
        </div>
      </Flex>
      <div style={{textAlign: "start", justifyContent: "start", width:1000}}>
          <h1>All Posts</h1>
      </div>
      <div className="listingDisplay">
        {/*change to filtered posts*/}
        <div style={{ overflow: 'auto', maxHeight: '250px' }}>
        {filteredPosts.map((post) => (
          <div className="postComp" onClick={() => routeChangeToOrder(post.postId)}>
            <SellerOrderCard>
            <div className="sellerOrderCardHeader">
            </div>
            <div className="sellerOrderCardBodyFlex">
                <div className="sellerOrderCardBodyFlex" style={{width: 70}}>
                    <img alt="cake" style={imgStyle} src={getCategoryUrl(post.postCategory)}/>
                </div>

                <div style={{width: 1100}} className="ctb">
                    <h2>#ID{post.postId}: {post.title} [by POSTER]</h2>
                    <div className="flexBox">
                        <h4>{post.postCategory}</h4>
                        <div className="viewComments">
                            <FaComments style={{alignSelf: "center"}}/>
                            <h3>view comments</h3>
                        </div>
                    </div>
                </div>
            </div>
        </SellerOrderCard>
          </div>
        ))}</div>
        <div style={{textAlign: "start", justifyContent: "start", width:1000}}>
            <br/>
          <h1>My Posts</h1>
      </div>
      <div style={{ overflow: 'auto', maxHeight: '250px' }}>
        {filteredPosts.map((post) => (
          <div className="postComp" onClick={() => routeChangeToOrder(post.postId)}>
            <SellerOrderCard>
            <div className="sellerOrderCardHeader">
            </div>
            <div className="sellerOrderCardBodyFlex">
                <div className="sellerOrderCardBodyFlex" style={{width: 70}}>
                    <img alt="cake" style={imgStyle} src={getCategoryUrl(post.postCategory)}/>
                </div>

                <div style={{width: 1100}} className="ctb">
                    <h2>#ID{post.postId}: {post.title} [by POSTER]</h2>
                    <div className="flexBox">
                        <h4>{post.postCategory}</h4>
                        <div className="viewComments">
                            <FaComments style={{alignSelf: "center"}}/>
                            <h3>view comments</h3>
                        </div>
                    </div>
                </div>
            </div>
        </SellerOrderCard>
          </div>
        ))}
        </div>
      </div>
    </div>
    </div>
  );
};


const pfpStyle = {padding: 0.5, borderRadius: "50%", width: 30, height: 30,
                    objectFit: "cover", background: "grey", display:"block" }

const imgStyle = {height: 60, width: 60, objectFit:"cover", borderRadius: 10}



export default Forum;
