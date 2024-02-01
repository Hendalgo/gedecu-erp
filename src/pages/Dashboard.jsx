import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import SideBar from "../components/SideBar";

const Dashboard = () => {
  const { session, setSession } = useContext(SessionContext);
  if (!session) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <SideBar children={<Outlet />} />
    </div>
  );
};

export default Dashboard;
