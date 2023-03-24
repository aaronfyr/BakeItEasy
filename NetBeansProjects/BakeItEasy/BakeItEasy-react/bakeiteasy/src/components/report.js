import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
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
