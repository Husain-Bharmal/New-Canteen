import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllFoodItems } from "../../../redux/food/food.actions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "./sales.css";
const FoodItemTable = ({ foods, match, getAllFoodItems }) => {
  useEffect(() => {
    getAllFoodItems("all");
  }, [getAllFoodItems, match]);

  // Data for the bar chart
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    // Transform foods data for the bar chart
    const transformedData = foods.map((item) => ({
      name: item.name,
      quantitySold: item.totalItemSold,
      totalEarnings: item.totalEarnings,
    }));
    setBarChartData(transformedData);
  }, [foods]);

  // Find the most selling product
  const mostSellingProduct = foods.reduce((maxProduct, currentProduct) => {
    return currentProduct.totalItemSold > maxProduct.totalItemSold ? currentProduct : maxProduct;
  }, foods[0]);

  return (
    <div className="food-item-table">
      <h2>Food Item Sales Report</h2>

      {/* Display most selling product if it exists */}
      {mostSellingProduct && (
        <div className="most-selling-product">
          <h3>Most Selling Product:</h3>
          <div className="most-selling-product-details">
          <p>{mostSellingProduct.name}</p>
          <p>Quantity Sold: {mostSellingProduct.totalItemSold}</p>
          <p>Total Earnings: {mostSellingProduct.totalEarnings} Rs</p>
          </div>
        </div>
      )}

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Quantity Sold</th>
            <th>Total Amount Earned</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.totalItemSold}</td>
              <td>{item.totalEarnings !== 0 ? `${item.totalEarnings} Rs` : '0 Rs'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Chart */}
      <div className="bar-chart">
        {/* Bar Chart for Quantity Sold */}
        <div className="bar-chart-container bar-chart-container-quantity">
          <BarChart width={500} height={300} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantitySold" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Bar Chart for Total Earnings */}
        <div className="bar-chart-container bar-chart-container-earnings">
          <BarChart width={500} height={300} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalEarnings" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foods: state.food.foods,
});

export default connect(mapStateToProps, { getAllFoodItems })(FoodItemTable);
