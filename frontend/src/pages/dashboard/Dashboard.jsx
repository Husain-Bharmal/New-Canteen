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

  import "./Dashboard.css";

  const Dashboard = ({ getAdminORders, getMyOrders, user, loading }) => {
    const [condition, setCondition] = useState("component0");

    const componentMap = {
      component1: <GetUsersBtn />,
      component2: <AdminDashboard />,
      component3: <Sales />,
      // Add more components and conditions here
    };

    const renderComponent = () => {
      if (user && user.role === "admin") {
        return <AdminDashboard />;
      } else {
        if (["component1", "component2", "component3"].includes(condition)) {
          // If the condition is one of the buttons that should hide the Welcome component
          return componentMap[condition] || null;
        } else {
          return <Welcome userName={user?.name} />;
        }
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
    {user && user.role === "teacher" && (
      <>
        <button
          className="features_btn"
          onClick={() => handleButtonClick("component1")}
        >
          Users
        </button>
        <button
          className="features_btn"
          onClick={() => handleButtonClick("component3")}
        >
          Sales
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

  export default connect(mapStateToProps, {getMyOrders, getAdminORders })(Dashboard);
 

