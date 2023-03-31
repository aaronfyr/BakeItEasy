import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Report from "../components/report";
import AdminMenuBar from "../components/adminMenuBar";

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

  const handleBan = async (reportedUser) => {
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

  return (
    <div>
      <AdminMenuBar />
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
                reporter={report.reporter}
                reported={report.reportee}
                onBan={handleBan}
                onUnban={handleUnban}
              />
            </GridItem>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default ViewAllReports;
