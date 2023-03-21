import React, {useState} from "react";
import "./resources/viewOrder.css";
import SearchBarSection from "./searchBarSection";

function ViewOrder() {
    const data =  SearchBarSection.data;
    return (
        <div className="viewOrderPage">
            <div className="viewOrderLeft">
                <img className="img" alt="order pic" src="https://www.recipetineats.com/wp-content/uploads/2018/03/Chocolate-Cake_9-SQ.jpg?w=500&h=500&crop=1"></img>
                <div className="orderButtonRow">
                    <button className="orderButton">
                        <img alt="share icon" className="iconStyle" src={shareIcon}></img>
                        Share
                    </button>
                    <button className="orderButton">
                        <img alt="like icon" className="iconStyle" src={likeIcon}></img>
                        Likes
                    </button>
                </div>
                <h1> (product name) </h1>
            </div>
            <div className="viewOrderRight">
                <h1>test2</h1>
            </div>
        </div>

    );

}
const shareIcon = "https://cdn-icons-png.flaticon.com/512/929/929539.png";
const likeIcon = "https://cdn-icons-png.flaticon.com/512/1077/1077086.png";

export default ViewOrder;
