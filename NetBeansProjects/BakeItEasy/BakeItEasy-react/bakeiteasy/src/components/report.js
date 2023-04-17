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
import { React, useEffect, useState } from "react";

const Report = ({ reportId, title, reason, onBan, onUnban, onDismiss }) => {
  console.log(reportId);

  // fetch reporter
  const [reporter, setReporter] = useState();
  const [reporterUsername, setReporterUsername] = useState();
  const [reporterImagePath, setReporterImagePath] = useState();
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
        setReporterUsername(data.username);
        setReporterImagePath(data.imagePath);
      });
  }, [reportId, reporter]);

  // fetch reportee
  const [reportee, setReportee] = useState();
  const [reporteeUsername, setReporteeUsername] = useState();
  const [reporteeIsBanned, setReporteeIsBanned] = useState();
  const [reporteeImagePath, setReporteeImagePath] = useState();
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/reports/${reportId}/reportee`,
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
        setReportee(data);
        setReporteeUsername(data.username);
        setReporteeIsBanned(data.isBanned);
        setReporteeImagePath(data.imagePath);
      });
  }, [reporteeIsBanned, reportId]);

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

  const handleDismiss = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to dismiss this report?"
    );
    if (!confirmed) {
      return;
    }
    onDismiss({ reportId, title, reason, reporter, reportee });
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <Text style={{ marginRight: "0.65rem" }}>
              <strong>Reporter: </strong>
            </Text>
            <div
              className="adminProfilePhoto"
              style={{ marginRight: "0.5rem" }}
            >
              <img
                className="homepageProfilePhotoImg"
                src={reporterImagePath}
                alt="baked listing"
              />
            </div>
            <Text>{reporterUsername}</Text>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Text style={{ marginRight: "0.5rem" }}>
              <strong>Reported: </strong>
            </Text>
            <div
              className="adminProfilePhoto"
              style={{ marginRight: "0.5rem" }}
            >
              <img
                className="homepageProfilePhotoImg"
                src={reporteeImagePath}
                alt="baked listing"
              />
            </div>
            <Text>{reporteeUsername}</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {reporteeIsBanned ? (
              <Button
                bg="#E2725B"
                colorScheme="white"
                onClick={handleUnban}
                flex="1"
                marginRight="2"
              >
                Unban
              </Button>
            ) : (
              <Button
                bg="#E2725B"
                colorScheme="white"
                onClick={handleBan}
                flex="1"
                marginRight="2"
              >
                Ban
              </Button>
            )}

            <Button
              bg="#E2725B"
              colorScheme="white"
              onClick={handleDismiss}
              flex="1"
            >
              Dismiss
            </Button>
          </div>
        </Stack>
      </CardBody>

      {true.isBanned && (
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
