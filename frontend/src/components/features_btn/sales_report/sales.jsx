import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllFoodItems } from "../../../redux/food/food.actions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
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

  // // Find the most selling product
  // const mostSellingProduct = foods.reduce(
  //   (max, current) => {
  //     if (current.totalItemSold > max[0].totalItemSold) {
  //       return [current];
  //     } else if (current.totalItemSold === max[0].totalItemSold) {
  //       max.push(current);
  //     }
  //     return max;
  //   },
  //   [foods[0]]
  // );

  // Find the maximum totalItemSold value
const maxTotalItemSold = Math.max(...foods.map((product) => product.totalItemSold));

// Filter products that have the maximum totalItemSold value
const mostSellingProduct = foods.filter((product) => product.totalItemSold === maxTotalItemSold);

  return (
    <div className="food-item-table">
      <h2>Food Item Sales Report</h2>

      {/* Display most selling product if it exists */}
      {mostSellingProduct.length > 0 && (
        <div className="most-selling-product">
          <h3>Most Selling Products:</h3>
          {mostSellingProduct.map((product, index) => (
            <div key={index} className="most-selling-product-details">
              <p>{product?.name}</p>
              <p>Quantity Sold: {product?.totalItemSold}</p>
              <p>Total Earnings: {product?.totalEarnings} Rs</p>
            </div>
          ))}
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
              <td>
                {item.totalEarnings !== 0 ? `${item.totalEarnings} Rs` : "0 Rs"}
              </td>
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
