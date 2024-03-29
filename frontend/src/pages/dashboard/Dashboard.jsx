import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "../../components/loader/Loader";
import { connect } from "react-redux";
import { getAdminORders } from "../../redux/order/order.actions";
import { getMyOrders } from "../../redux/order/order.actions";
import AdminDashboard from "../../components/admin-dashboard/AdminDashboard";
// import UserDashboard from "../../components/user-dashboard/UserDashboard";
import GetUsersBtn from "../../components/features_btn/users/Users";
import Welcome from "../../components/features_btn/welcome/Welcome";
import Sales from "../../components/features_btn/sales_report/sales";
import { getAllFoodItems } from "../../redux/food/food.actions";
import Report from "../../components/features_btn/report/Report";

import "./Dashboard.css";
import FeedbackView from "../../components/features_btn/feedback/Feedback_view";

const Dashboard = ({ getAdminORders, getMyOrders, user, loading }) => {
  const [condition, setCondition] = useState("component0");

  const componentMap = {
    component1: <GetUsersBtn />,
    component2: <AdminDashboard />,
    component3: <Sales foodItems={"all"} />,
    component4: <FeedbackView/>,
    component5:<Report/>
    // Add more components and conditions here
  };

  const renderComponent = () => {
    if (["component1", "component2", "component3", "component4","component5"].includes(condition)) {
      // If the condition is one of the buttons that should hide the Welcome component
      return componentMap[condition] || null;
    } else {
      return <Welcome userName={user?.name} />;
    }
  };

  const handleButtonClick = (newCondition) => {
    setCondition(newCondition);
    console.log("New condition:", newCondition);
  };

  useEffect(() => {
    getAdminORders();
  }, [getAdminORders]);

  useEffect(() => {
    getMyOrders();
  }, [getMyOrders]);

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
            {user && user.role === "admin" && (
              <>
                <button
                  className="features_btn"
                  onClick={() => handleButtonClick("component1")}
                >
                  Users
                </button>
                  <button
                    className="features_btn"
                    onClick={() => {handleButtonClick("component3"); getAllFoodItems("all")}}
                  >
                    Sales
                  </button>
                  <button
                    className="features_btn"
                    onClick={() => {handleButtonClick("component4")}}
                  >
                    Feedbacks
                  </button>
                  <button
                    className="features_btn"
                    onClick={() => {handleButtonClick("component5")}}
                  >
                    Report
                  </button>
              </>
            )}
            <button
              className="features_btn"
              onClick={() => handleButtonClick("component2")}
            >
              Orders
            </button>
          </div>
        </div>
        <div>
          <h1 className="dashboard-text">Dashboard</h1>
          {/* <Welcome userName={user?.name} /> */}
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

export default connect(mapStateToProps, { getMyOrders, getAdminORders })(
  Dashboard
);
