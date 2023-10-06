import React from "react";
import { useEffect } from "react";
import { getAllFoodItems } from "../../../redux/food/food.actions";
import { connect } from "react-redux";
import "./sales.css";

const FoodItemTable = ({ foods,foodItems ,match, getAllFoodItems}) => {
  console.log("food items are:",foods);
  useEffect(() => {
    getAllFoodItems("all");
  }, [getAllFoodItems, match]);
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
          {foods.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>  
              <td>{item.totalItemSold}</td>
              <td>{item.totalItemSold !== 0 ? `${item.totalEarnings} Rs` : '0 Rs'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps =(state)=>({
  foods: state.food.foods,
});

export default connect(mapStateToProps,{getAllFoodItems})(FoodItemTable);
