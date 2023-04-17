import { React, useEffect, useState, memo } from "react";
import { toast, ToastContainer } from "react-toastify";

import { Rating } from "react-simple-star-rating";

import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
  VStack,
} from "@chakra-ui/react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { FaRegStar } from "react-icons/fa";
import { MdOutlineReport } from "react-icons/md";

export function OrderReportButtonNonMemo({ buyerId, oId, orderStatus }) {
  const [isOrderReviewed, setIsOrderReviewed] = useState({});
  const [ordersChecked, setOrdersChecked] = useState({});

  const getReportStatusByOId = async (oId) => {
    const sellerResponse = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/seller`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const sellerData = await sellerResponse.json();
    const sellerId = sellerData.sellerId;

    if (sellerResponse.ok) {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/${sellerId}/hasExistingReport`,
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
    }
  };

  // handleReportSeller
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");

  const handleReportSeller = async (event) => {
    event.preventDefault();
    const sellerResponse = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/seller`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const sellerData = await sellerResponse.json();
    const sellerId = sellerData.sellerId;
    const sellerUsername = sellerData.username;

    if (sellerResponse.ok) {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/sellers/${sellerId}/reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            reason,
          }),
        }
      );
      if (response.ok) {
        // redirect to homepage
        console.log("reported seller!");
        setTitle("-");
        toast.success(
          `Reported Seller ${sellerUsername}. Refreshing, please wait...`
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        console.log("reporting error:", errorData.error);
        toast.error(`${errorData.error}. Refreshing, please wait...`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } else {
      // show error messageconst
      const errorData = await sellerResponse.json();
      toast.error(errorData.error);
    }
  };

  // return render statements
  if (ordersChecked[oId]) {
    return (
      <>
        <Popup
          trigger={
            <Flex>
              {!isOrderReviewed[oId] && (
                <div className="button1_report">
                  <HStack spacing="8px">
                    <div>Report Seller </div>
                    <MdOutlineReport size="1.2rem" />
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
              <div className="header"> Report Seller </div>
              <HStack>
                <Spacer />
                <div className="content">
                  <form onSubmit={(event) => handleReportSeller(event)}>
                    <FormControl mt={4}>
                      <FormLabel>Title of Report: </FormLabel>
                      <Input
                        type="text"
                        placeholder=" "
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Reason: </FormLabel>
                      <Input
                        type="text"
                        placeholder=" "
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        required
                      />
                    </FormControl>
                    <Box mt={4} display="flex" alignItems="center">
                      <Button
                        bg="#E2725B"
                        colorScheme="white"
                        type="submit"
                        w="100%"
                      >
                        Submit Report
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
    getReportStatusByOId(oId);
  }
}

export const OrderReportButton = memo(OrderReportButtonNonMemo);
