import React from "react";
import "./sales.css";

const FoodItemTable = ({ foodItems }) => {
    if (!foodItems || foodItems.length === 0) {
        return <div>No data available.</div>; // You can provide a message or UI for no data.
      }
  return (
    <div className="food-item-table">
      <h2>Food Item Sales Report</h2>
      <table>
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Quantity Sold</th>
            <th>Total Amount Earned</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantitySold}</td>
              <td>${item.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodItemTable;
