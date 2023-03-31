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

const Report = ({ title, reason, reporter, reportee, onBan }) => {
  const handleBanClick = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to ban this user?");
    if (!confirmed) {
      return;
    }
    await onBan(reportee);
  };

  return (
    <Card maxW="sm">
      <CardBody>
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text> {reason}</Text>
          <Text> {reporter}</Text>
          <Text> {reportee}</Text>
          {/* <Button
            bg="#E2725B"
            onClick={handleBanClick}
            visibility={reportee.isBanned ? "hidden" : "visible"}
          >
            Ban reported user
          </Button> */}
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Report;
