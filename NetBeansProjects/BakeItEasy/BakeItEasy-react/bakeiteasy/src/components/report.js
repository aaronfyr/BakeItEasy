import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import {
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";

const Report = ({ title, reason, reporter, reported }) => {
  const handleClick = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8080/${
        reported.constructor.name === "Seller" ? "sellers" : "buyers"
      }/ban`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          reason,
          reporter,
          reported,
        }),
      }
    );
  };
  return (
    <Card maxW="sm">
      <CardBody>
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text> {reason}</Text>
          <Text> {reporter}</Text>
          <Text> {reported}</Text>
          <Button
            bg="#E2725B"
            onClick={handleClick}
            visibility={reported.isBanned ? "hidden" : "visible"}
          >
            Ban reported user
          </Button>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Report;
