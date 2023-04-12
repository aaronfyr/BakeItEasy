import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenuBar from "../components/adminMenuBar";
import AdminEditDetails from "../components/adminEditDetails";
import "./resources/default.css";

function AdminProfilePage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const admin = localStorage.getItem("admin");
      // setAdmin({
      //   id: "1",
      //   name: "test",
      //   email: "email",
      //   password: "password",
      // });
      if (!admin) {
        navigate("/adminLogin");
      } else {
        const parsedUser = JSON.parse(admin);
        setAdmin(parsedUser);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <AdminMenuBar />
      {admin && (
        <AdminEditDetails
          id={admin.adminId}
          name={admin.name}
          email={admin.email}
          password={admin.password}
        />
      )}
    </div>
  );
}

export default AdminProfilePage;
