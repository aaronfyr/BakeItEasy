import classes from "./resources/sellerOrderCard.css";

const SellerOrderCard = (props) => {
    return <div className={`${classes.card} ${props.className}`}>{props.children}</div>
}

export default SellerOrderCard;
