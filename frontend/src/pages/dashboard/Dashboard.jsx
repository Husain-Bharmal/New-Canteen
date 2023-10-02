import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "../../components/loader/Loader";
import { connect } from "react-redux";
import { getAdminORders } from "../../redux/order/order.actions";
import AdminDashboard from "../../components/admin-dashboard/AdminDashboard";
// import UserDashboard from "../../components/user-dashboard/UserDashboard";
import GetUsersBtn from "../../components/features_btn/users/Users"
import Welcome from "../../components/features_btn/welcome/Welcome";
import Sales from "../../components/features_btn/sales_report/sales"

import "./Dashboard.css";

const Dashboard = ({ getAdminORders, user, loading }) => {
  const [condition, setCondition] = useState("component0");

  const componentMap = {
    component0:<Welcome/>,
    component1: < GetUsersBtn/>,
    component2: <AdminDashboard />,
    component3:<Sales/>,
    // Add more components and conditions here
  };

  const renderComponent = () => {
    return componentMap[condition] || null; // Return null for unknown conditions
  };


  useEffect(() => {
    getAdminORders();
  }, [getAdminORders]);

  return (
    <div>
      {loading && <Loader />}
      <div className="dashboard-root">
        <div className="profile-details">
          <div className="profile">
            
            <p>
              <b>User: </b> {user?.name}
            </p>
            <p>
              <b>Branch: </b> {user?.branch}
            </p>
            <p>
              <b>Role: </b>
              {user?.role}
            </p>
          </div>
          <div className="features_btn_div">
          <button className="features_btn" onClick={() => setCondition("component1")}>Users</button>
          <button className="features_btn" onClick={() => setCondition("component2")}>Orders</button>
          <button className="features_btn" onClick={() => setCondition("component3")}>Sales</button>
          </div>
        </div>
        <div>
          <h1 className="dashboard-text">Dashboard</h1>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  orders: state.order.orders,
  loading: state.order.loading,
});

export default connect(mapStateToProps, { getAdminORders })(Dashboard);
