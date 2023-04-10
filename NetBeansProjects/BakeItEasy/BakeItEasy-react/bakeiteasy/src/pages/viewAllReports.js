import {
  Grid,
  GridItem,
  Box,
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
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Report from "../components/report";
import AdminMenuBar from "../components/adminMenuBar";

import { ToastContainer, toast } from "react-toastify";

function ViewAllReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/reports`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const res = await response.json();
        setReports(res);
      } else {
        setError("There is an error with loading reports");
      }
    }

    fetchData();
  }, []);

  const handleBanSeller = async (reportedUser) => {
    console.log("handleban:", reportedUser);
    console.log("handleban: reporter", reportedUser.reporter);
    console.log(
      "handleban: reportee.sellerId",
      reportedUser.reportee.sellerId.toString()
    );
    const reporteeId = reportedUser.reportee.sellerId.toString();
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/ban/sellers/${reporteeId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      /*
      const updatedReports = reports.map((report) => {
        if (report.reportee.username === reportedUser.username) {
          return {
            ...report,
            reportee: {
              ...reportedUser,
              isBanned: true,
            },
          };
        } else {
          return report;
        }
      });
      setReports(updatedReports);
      */
      toast.success("Reportee banned.");
      onBanOpen();
    } else {
      // setError("There is an error with the ban request");
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  const handleUnbanSeller = async (reportedUser) => {
    console.log("handleUnban:", reportedUser);
    console.log("handleUnban: reporter", reportedUser.reporter);
    console.log(
      "handleUnban: reportee.sellerId",
      reportedUser.reportee.sellerId
    );
    const reporteeId = reportedUser.reportee.sellerId;
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/unban/sellers/${reporteeId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      /*
      const updatedReports = reports.map((report) => {
        if (report.reportee.username === reportedUser.username) {
          return {
            ...report,
            reportee: {
              ...reportedUser,
              isBanned: false,
            },
          };
        } else {
          return report;
        }
      });
      setReports(updatedReports);
      */
      toast.success("Reportee unbanned.");
      onUnbanOpen();
      //window.location.reload();
    } else {
      // setError("There is an error with the unban request");
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  /*
  const handleBan = async (reportedUser) => {
    console.log("handleban:", reportedUser);
    console.log("handleban: reportee", reportedUser);
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/ban/${
        reportedUser.constructor.name === "Seller" ? "sellers" : "buyers"
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedReports = reports.map((report) => {
        if (report.reportee.username === reportedUser.username) {
          return {
            ...report,
            reportee: {
              ...reportedUser,
              isBanned: true,
            },
          };
        } else {
          return report;
        }
      });
      setReports(updatedReports);
    } else {
      setError("There is an error with the ban request");
    }
  };

  const handleUnban = async (reportedUser) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/unban/${
        reportedUser.constructor.name === "Seller" ? "sellers" : "buyers"
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedReports = reports.map((report) => {
        if (report.reportee.username === reportedUser.username) {
          return {
            ...report,
            reportee: {
              ...reportedUser,
              isBanned: false,
            },
          };
        } else {
          return report;
        }
      });
      setReports(updatedReports);
    } else {
      setError("There is an error with the unban request");
    }
  };
  */

  // successful ban/unban modal
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(5px) hue-rotate(-10deg)"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBanOpen,
    onOpen: onBanOpen,
    onClose: onBanClose,
  } = useDisclosure();
  const {
    isOpen: isUnbanOpen,
    onOpen: onUnbanOpen,
    onClose: onUnbanClose,
  } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  return (
    <div>
      <AdminMenuBar />
      <Modal isCentered isOpen={isBanOpen} onClose={onBanClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Banned Seller.</ModalHeader>
          <Flex>
            <Spacer />
            <ModalBody>
              <img
                width="250px"
                height="250px"
                src={require("../assets/ban.gif")}
                alt="listing product"
              />
            </ModalBody>
            <Spacer />
          </Flex>
          <Flex>
            <Spacer />
            <ModalFooter>
              <Button
                onClick={() => window.location.reload()}
                colorScheme="orange"
                variant="ghost"
              >
                Return to Reports
              </Button>
            </ModalFooter>
            <Spacer />
          </Flex>
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={isUnbanOpen} onClose={onUnbanClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Unbanned Seller.</ModalHeader>
          <Flex>
            <Spacer />
            <ModalBody>
              <img
                width="250px"
                height="250px"
                src={require("../assets/unban.gif")}
                alt="listing product"
              />
            </ModalBody>
            <Spacer />
          </Flex>
          <Flex>
            <Spacer />
            <ModalFooter>
              <Button
                onClick={() => window.location.reload()}
                colorScheme="orange"
                variant="ghost"
              >
                Return to Reports
              </Button>
            </ModalFooter>
            <Spacer />
          </Flex>
        </ModalContent>
      </Modal>
      <ToastContainer />
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" mb={8}>
          Reports
        </Text>
      </Box>
      {reports.length === 0 ? (
        <Box textAlign="center">
          <Text>No reports found</Text>
        </Box>
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {reports.map((report) => (
            <GridItem key={report.reportId} colSpan={1}>
              <Report
                reportId={report.reportId}
                title={report.title}
                reason={report.reason}
                onBan={handleBanSeller}
                onUnban={handleUnbanSeller}
              />
            </GridItem>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default ViewAllReports;
