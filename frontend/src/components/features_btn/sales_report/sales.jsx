import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllFoodItems } from "../../../redux/food/food.actions";
import "./sales.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FoodItemTable = ({ foods, match, getAllFoodItems }) => {
  // Log the current state of food items
  console.log("food items are:", foods);

  // Use useEffect to fetch all food items when the component mounts or when 'match' changes
  useEffect(() => {
    getAllFoodItems("all");
  }, [getAllFoodItems, match]);

  // Data for the bar chart (you can customize this based on your data structure)
  const data = foods.map((item) => ({
    name: item.name,
    quantitySold: item.totalItemSold,
    totalEarnings: item.totalEarnings,
  }));

  return (
    <div className="food-item-table">
      <h2>Food Item Sales Report</h2>
      
      {/* Table to display food item sales information */}
      <table>
        {/* Table header */}
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Quantity Sold</th>
            <th>Total Amount Earned</th>
          </tr>
        </thead>
        {/* Table body with data from 'foods' array */}
        <tbody>
          {foods.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.totalItemSold}</td>
              {/* Display total earnings or '0 Rs' if it's zero */}
              <td>{item.totalEarnings !== 0 ? `${item.totalEarnings} Rs` : '0 Rs'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantitySold" fill="#8884d8" />
          <Bar dataKey="totalEarnings" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foods: state.food.foods,
});

export default connect(mapStateToProps, { getAllFoodItems })(FoodItemTable);
