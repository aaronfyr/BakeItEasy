import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AdminContext } from "../context/adminProvider";

function AdminMenuBar() {
  const { admin } = useContext(AdminContext);
  //const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const admin = localStorage.getItem("user");
      // setAdmin({
      //   id: "1",
      //   name: "test",
      //   email: "email",
      //   password: "password",
      // });
      if (!admin) {
        //navigate("/adminLogin");
      } else {
        //const parsedUser = JSON.parse(admin);
        //setAdmin(parsedUser);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="navbar">
      <Flex align="center">
        <Link
          to="/adminProfilePage"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            width="50px"
            height="50px"
            hspace="30px"
            src={require("../assets/bakeiteasy-logo.png")}
            alt="BakeItEasy"
            style={{ marginRight: "10px" }}
          ></img>
          <div className="logo">BakeItEasy</div>
        </Link>
      </Flex>
      <Flex align="center">
        <Link to="/viewAllReports" style={{ marginRight: "50px" }}>
          <Text>Reports</Text>
        </Link>
        <Link to="/viewAllBuyers" style={{ marginRight: "50px" }}>
          <Text>Buyers</Text>
        </Link>
        <Link to="/viewAllSellers" style={{ marginRight: "50px" }}>
          <Text>Sellers</Text>
        </Link>

        {admin && (
          <Link to="/adminProfilePage" style={{ marginLeft: "200px" }}>
            <Text fontWeight="bold">{admin.email}</Text>
          </Link>
        )}
      </Flex>
      <div style={{ width: "25px" }}></div>
    </div>
  );
}

export default AdminMenuBar;
