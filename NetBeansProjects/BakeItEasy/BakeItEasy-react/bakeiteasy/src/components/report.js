import { React, useEffect, useState } from "react";
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

const Report = ({ reportId, title, reason, onBan, onUnban }) => {
  console.log(reportId);

  // fetch reporter
  const [reporter, setReporter] = useState();
  const [reporterName, setReporterName] = useState();
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
        setReporterName(data.name);
        setReporterUsername(data.username);
        setReporterImagePath(data.imagePath);
      });
  }, []);

  // fetch reportee
  const [reportee, setReportee] = useState();
  const [reporteeName, setReporteeName] = useState();
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
        setReporteeName(data.name);
        setReporteeUsername(data.username);
        setReporteeIsBanned(data.isBanned);
        setReporteeImagePath(data.imagePath);
      });
  }, [reporteeIsBanned]);

  const handleBanClick = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to ban this user?");
    if (!confirmed) {
      return;
    }
    setReporteeIsBanned(true);
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
          {reporteeIsBanned ? (
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
