import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Report from "../components/report";
import AdminMenuBar from "../components/adminMenuBar";

function ViewAllReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/http://localhost:8080/reports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        setReports(res);
      } else {
        setError("There is an error with the report loading");
      }
    }

    fetchData();
  }, []);

  const handleBan = (reportedUser) => {
    const updatedReports = reports.map((report) => {
      if (report.reported.username === reportedUser.username) {
        return {
          ...report,
          reported: {
            ...reportedUser,
            isBanned: true,
          },
        };
      } else {
        return report;
      }
    });
    setReports(updatedReports);
  };

  return (
    <div>
      <AdminMenuBar />
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" mb={8}>
          Reports
        </Text>
      </Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {reports.map((report) => (
          <GridItem key={report.id} colSpan={1}>
            <Report
              title={report.title}
              reason={report.reason}
              reporter={report.reporter}
              reported={report.reported}
              onBan={handleBan}
            />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}

export default ViewAllReports;
