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

const Report = ({
  reportId,
  title,
  reason,
  reporter,
  reportee,
  onBan,
  onUnban,
}) => {
  const handleBanClick = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to ban this user?");
    if (!confirmed) {
      return;
    }
    await onBan(reportee);
  };

  const handleBan = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to ban the reported user?"
    );
    if (!confirmed) {
      return;
    }
    onBan({ reportId, title, reason, reporter, reportee });
  };

  const handleUnban = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to unban the reported user?"
    );
    if (!confirmed) {
      return;
    }
    onUnban({ reportId, title, reason, reporter, reportee });
  };

  return (
    <Card maxW="sm">
      <CardBody>
        <Stack spacing="3">
          <Heading size="md">{title}</Heading>
          <Text>
            <strong>Reason: </strong>
            {reason}
          </Text>
          <Text>
            <strong>Reporter: </strong>
            {reporter}
          </Text>
          <Text>
            <strong>Reported: </strong>
            {reportee}
          </Text>

          {reportee.isBanned ? (
            <Button bg="#E2725B" colorScheme="white" onClick={handleUnban}>
              Unban
            </Button>
          ) : (
            <Button bg="#E2725B" colorScheme="white" onClick={handleBan}>
              Ban
            </Button>
          )}
        </Stack>
      </CardBody>

      {reportee.isBanned && (
        <CardFooter bg="red.500" textAlign="center">
          <Text color="white" fontSize="sm" width="100%">
            This reported user is banned
          </Text>
        </CardFooter>
      )}
      <Divider />
    </Card>
  );
};

export default Report;
