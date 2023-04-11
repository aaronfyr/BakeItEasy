import { React, useEffect, useState } from "react";
import Aos from "aos";
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
} from "@chakra-ui/react";

const Post = ({ postId, title, dateCreated, postCategory, isBuyer }) => {
  console.log("in post:", postId);

  // fetch reporter
  /*
  const [reporter, setReporter] = useState();
  const [reporterName, setReporterName] = useState();
  const [reporterUsername, setReporterUsername] = useState();
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/reports/${reportId}/reporter`,
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
        console.log("reporter: ", reporter);
        setReporter(data);
        setReporterName(data.name);
        setReporterUsername(data.username);
      });
  }, []);
  */

  /*
  const handleBan = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to ban the reported user?"
    );
    if (!confirmed) {
      return;
    }
    setReporteeIsBanned(false);
    onBan({ reportId, title, reason, reporter, reportee });
  };
  */

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div data-aos="fade-left" className="postCard">
      <div className="postCardContentGrid">
        <div className="postCardContentGrid_left">{postId}</div>

        <div className="postCardContentGrid_right">
          <div className="postCardHeader">{postId}</div>
          <h1>{title}</h1>
          <h4 className="details">{dateCreated}</h4>
          <div className="postCardFooter">{postId}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
