import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminEditDetails from "../components/adminEditDetails";
import AdminMenuBar from "../components/adminMenuBar";
import "./resources/default.css";

function AdminProfilePage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const admin = localStorage.getItem("admin");
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
