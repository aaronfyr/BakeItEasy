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
    //   const response = await fetch(`/http://localhost:8080/getAllReports`, {});

      if (true) {
        // const res = await response.json();
        // setReports(res);
        setReports([
            { id: 1, title: "report 1", reason: "reason 1", reporter: "reporter 1", reported: "reported 1" },
            { id: 2, title: "report 1", reason: "reason 1", reporter: "reporter 1", reported: "reported 1" },
            { id: 3, title: "report 1", reason: "reason 1", reporter: "reporter 1", reported: "reported 1" },
            { id: 4, title: "report 1", reason: "reason 1", reporter: "reporter 1", reported: "reported 1" },
        ])
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
