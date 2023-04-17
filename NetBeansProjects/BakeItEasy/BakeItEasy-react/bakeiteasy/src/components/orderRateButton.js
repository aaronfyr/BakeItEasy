import { React, memo, useState } from "react";
import { toast } from "react-toastify";

import { Rating } from "react-simple-star-rating";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spacer,
} from "@chakra-ui/react";
import { FaRegStar } from "react-icons/fa";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export function OrderRateButtonNonMemo({ oId, orderStatus }) {
  const [isOrderReviewed, setIsOrderReviewed] = useState({});
  const [ordersChecked, setOrdersChecked] = useState({});

  const getReviewStatusByOId = async (oId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/hasExistingReview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("isOrderReviewed: ", data);
      console.log("isOrderReviewed typeof: ", typeof data);
      setIsOrderReviewed({ ...isOrderReviewed, [oId]: data });
      setOrdersChecked({ ...ordersChecked, [oId]: 1 });

      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      } else {
        console.log("not SyntaxError", error);
      }
    }
  };

  // handleCreateReview
  const [reviewText, setReviewText] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [imagePaths, setImagePath] = useState(["", "text"]);
  const handleCreateReview = async (event) => {
    event.preventDefault();
    const dateCreated = new Date();
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          reviewText,
          rating,
          imagePaths,
          dateCreated,
        }),
      }
    );
    if (response.ok) {
      // redirect to homepage
      console.log("created rating: ", oId);
      toast.success(
        `Submitted review for Order #${oId}! Refreshing, please wait...`
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      const errorData = await response.json();
      toast.error(`${errorData.error}. Refreshing, please wait...`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleRating = (rate) => {
    setRating(rate);
    console.log("handleRating:", rating);
  };

  // return render statements
  if (ordersChecked[oId]) {
    return (
      <>
        <Popup
          trigger={
            <Flex>
              {!isOrderReviewed[oId] && orderStatus === "COMPLETED" && (
                <div className="button1_report">
                  <HStack spacing="8px">
                    <div>Rate</div>
                    <FaRegStar size="1.2rem" />{" "}
                  </HStack>
                </div>
              )}
            </Flex>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <button className="close" onClick={close}>
                <div className="closeButton">X</div>
              </button>
              <div className="header"> Make A Review </div>

              <HStack>
                <Spacer />
                <div className="content">
                  <form onSubmit={(event) => handleCreateReview(event, oId)}>
                    <FormControl mt={4}>
                      <FormLabel> Review Title: </FormLabel>
                      <Input
                        type="text"
                        placeholder=" "
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Text: </FormLabel>
                      <Input
                        type="text"
                        placeholder=" "
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Rating: </FormLabel>
                      <Rating
                        name="simple-controlled"
                        onClick={handleRating}
                        initialValue={rating}
                        className="ratingClass"
                      />
                    </FormControl>
                    <Box mt={4} display="flex" alignItems="center">
                      <Button
                        bg="#E2725B"
                        colorScheme="white"
                        type="submit"
                        w="100%"
                      >
                        Submit Review
                      </Button>
                    </Box>
                  </form>
                </div>
                <Spacer />
              </HStack>
            </div>
          )}
        </Popup>
      </>
    );
  } else {
    getReviewStatusByOId(oId);
  }
}

export const OrderRateButton = memo(OrderRateButtonNonMemo);
