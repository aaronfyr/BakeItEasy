import { color } from "framer-motion";
import React, {useState} from "react";
import "./resources/searchBarSection.css";
import SellerOrderCard from "./sellerOrderCard.js";
import CategoryDropdown from "../components/categoryDropdown";
import { NavigationBar } from "../components/buyerNavigationBar";
import {FaListUl} from "react-icons/fa";
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";


/*const orderResponse = await fetch(``)*/

const SearchBarSection = () => {

  const [products, setProducts] = useState(data);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
    console.log({selectedCategory});
  };

  const filteredProducts = products.filter((product) => {
    if (
      (product.tags.toLowerCase().includes(search) ||
      product.title.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.buyerName.toLowerCase().includes(search) ||
      product.notes.toLowerCase().includes(search)) ||
      product.category.toLowerCase().includes({selectedCategory})
        // cant get the frickin filter to work
    ) {
      return product;
    }
  });


   let navigate = useNavigate();
  const routeChangeToOrder = (id) => {
    let path = "listing/";
    navigate(path + id);
  };

  return (
    <div>
        <NavigationBar/>
        <div className="dropdownRow">
            <div className="heading">
                <h1>My listings with orders</h1>
            </div>
        <CategoryDropdown onCategoryChange={handleCategoryChange}/>
        <body style={{fontFamily: 'Montserrat'}}>Selected category: {selectedCategory}</body>
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
        {filteredProducts.map((product) => (
          <div className="listingComponent" onClick={() => routeChangeToOrder(product.id)}>
            <SellerOrderCard>
            <div className="sellerOrderCardHeader">
            <img style={pfpStyle} alt="profile pic" width="50" src="https://st.depositphotos.com/1597387/1984/i/950/depositphotos_19841901-stock-photo-asian-young-business-man-close.jpg"></img>
            <h3 className="buyerName">{product.buyerName}</h3>
            </div>
            <div className="sellerOrderCardBodyFlex">
                <div className="sellerOrderCardBodyFlex">
                    <img alt="cake" style={imgStyle} src={product.url}/>
                </div>

                <div style={{width: 400}} className="cardTextBlock">
                    <h2>{product.title} [${product.price}]</h2>
                    <h4>{product.category}</h4>
                    <h3>no. of orders: (number) </h3>
                    <div className="flexBox">
                        <div className="searchBarButton1">
                            <FaListUl style={{alignSelf: "center"}}/>
                            <h3>view orders</h3>
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
  );
};

const data = [{
      id: 1,
      buyerName:"chocLover123",
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
      buyerName:"janeTan",
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
      buyerName:"johnDoe",
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
      buyerName:"BakerBoy567",
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
      buyerName:"breadBro",
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
      buyerName:"jellycat987",
      title: "Jelly Cake",
      category: "Desserts",
      price: "55.4",
      tags: "hoodie solid plain gray grey short hood",
      url: "https://img.taste.com.au/gym_Wtb0/taste/2022/10/singapore-sling-jelly-cake-181810-1.png",
      notes: "use red jelly",
      status: "accepted",
    }];

const pfpStyle = {padding: 0.5, borderRadius: "50%", width: 30, height: 30,
                    objectFit: "cover", background: "grey", display:"block" }

const imgStyle = {height: 150, width: 150, objectFit:"cover", borderRadius: 10}



export default SearchBarSection;
