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

const Report = ({ title, reason, reporter, reported, onBan }) => {
  const handleBanClick = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to ban this user?");
    if (!confirmed) {
      return;
    }
    await onBan(reported);
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
            onClick={handleBanClick}
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
