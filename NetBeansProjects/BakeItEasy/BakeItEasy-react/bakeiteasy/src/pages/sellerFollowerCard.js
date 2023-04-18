import classes from "./resources/sellerFollowerCard.css";

const SellerFollowerCard = (props) => {
  return (
    <div className={`${classes.card} ${props.className}`}>{props.children}</div>
  );
};

export default SellerFollowerCard;
