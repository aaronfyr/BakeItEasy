import { React, useEffect, useState } from "react";
import Aos from "aos";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { FiUserPlus, FiUserMinus, FiMessageSquare } from "react-icons/fi";

const Post = ({ postId, title, dateCreated, postCategory, isBuyer }) => {
  const navigate = useNavigate();

  console.log("in post:", postId);

  // fetch poster
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [userUsername, setUserUsername] = useState();
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/posts/${postId}/${
        isBuyer ? "buyer" : "seller"
      }`,
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
        console.log("post user: ", data);
        setUser(data);
        if (isBuyer) {
          setUserId(data.buyerId);
        } else {
          setUserId(data.sellerId);
        }
        setUserName(data.name);
        setUserUsername(data.username);
      });
  }, []);

  /* FOLLOWING FUNCTIONS */
  // fetch current viewer if it's a buyer, then fetch its following
  const [buyer, setBuyer] = useState();
  const [buyerId, setBuyerId] = useState();
  useEffect(() => {
    async function fetchData() {
      const fetchedBuyer = localStorage.getItem("buyer");
      if (!fetchedBuyer) {
        console.log("buyer view of forum", "not buyer");
      } else {
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          setBuyerId(parsedUser.buyerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // fetch current buyer followings
  const [followings, setFollowings] = useState();
  const [isFollowing, setIsFollowing] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let buyerId = null;
        const fetchedBuyer = localStorage.getItem("buyer");
        if (!fetchedBuyer) {
          navigate("/login");
        } else {
          const parsedUser = JSON.parse(fetchedBuyer);
          buyerId = parsedUser.buyerId;
          console.log("buyerId to get followings", buyerId);
        }

        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/followings/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setFollowings(data);
        console.log("sellerProfile, followings: ", followings);
        const checkIsFollowing = data.some(
          (val) => val.sellerId.toString() === userId
        );

        setIsFollowing(checkIsFollowing);
        console.log("sellerProfile, isFollowing: ", isFollowing);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, []);

  // handleFollowSeller
  const handleFollowSeller = async (sId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sId}/${buyerId}/follow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsFollowing(true);
      toast.success(`Followed Seller!`);
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  // handleUnfollowSeller
  const handleUnfollowSeller = async (sId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sId}/${buyerId}/unfollow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsFollowing(false);
      console.log("unfollowed SellerId# ", sId);

      toast.success(`Unfollowed Seller.`);
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div data-aos="fade-left" className="postCard">
      <div className="postCardContentGrid">
        <div className="postCardContentGrid_left">{postId}</div>

        <div className="postCardContentGrid_right">
          <div className="postCardHeader">
            {isBuyer && (
              <HStack>
                <img
                  width="35px"
                  height="35px"
                  src={require("../assets/dummyuser.png")}
                  alt="listing product"
                />
                <div className="postBuyerHeader">{userUsername}</div>
              </HStack>
            )}
            {!isBuyer && (
              <HStack>
                <HStack>
                  <img
                    width="35px"
                    height="35px"
                    src={require("../assets/dummyuser.png")}
                    alt="listing product"
                  />
                  <div className="postSellerHeader">{userUsername}</div>
                </HStack>
                <Spacer />
                {!isFollowing && (
                  <div className="postSellerHeader">
                    <FiUserPlus
                      size="1.2rem"
                      onClick={() => handleFollowSeller(userId)}
                    />
                  </div>
                )}
                {isFollowing && (
                  <div className="postSellerHeader">
                    <FiUserMinus
                      size="1.2rem"
                      onClick={() => handleUnfollowSeller(userId)}
                    />
                  </div>
                )}
              </HStack>
            )}
          </div>
          <h1>{title}</h1>
          <h4 className="details">{dateCreated}</h4>
          <div className="postCardFooter">
            <div className="postFooterContent">
              <HStack>
                <FiMessageSquare size="1.2rem" />
                <div>View Comments</div>
              </HStack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
