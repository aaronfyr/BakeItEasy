import { useState } from "react";
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
  return (
    <Card maxW="sm">
      <CardBody>
        <Stack mt="6" spacing="3">
          <Heading size="md">
            {title}
          </Heading>
          <Text> {reason}</Text>
          <Text> {reporter}</Text>
          <Text> {reported}</Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Report;
