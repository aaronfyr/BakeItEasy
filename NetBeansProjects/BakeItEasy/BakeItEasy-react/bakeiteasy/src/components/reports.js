import {
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Report from "./report";

function Reports() {
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

  return (
    <div>
      <h1>Reports</h1>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {reports.map((report) => (
          <GridItem key={report.id} colSpan={1}>
            <Report
              title={report.title}
              reason={report.reason}
              reporter={report.reporter}
              reported={report.reported}
            />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}

export default Reports;
