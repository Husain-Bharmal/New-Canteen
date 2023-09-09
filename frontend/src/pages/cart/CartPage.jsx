import React, { useState } from "react";
import { connect } from "react-redux";
import {
  AddToCart,
  removeFromCart,
  clearItemFromCart,
} from "../../redux/cart/cart.actions";
import { getCartTotal } from "../../redux/cart/cart.utils";
import { placeOrder } from "../../redux/order/order.actions";
import { GrAdd, GrSubtract } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import "./CartPage.css";

const CartPage = ({
  cartItems,
  user,
  AddToCart,
  removeFromCart,
  clearItemFromCart,
  placeOrder,
  history,
}) => {
  const [roomNo, setRoomNo] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const orderDetails = {
      cart: cartItems.map((item) => ({
        name: item.name,
        image: item.image,
        foodType: item.foodType,
        price: item.price * item.quantity,
        quantity: item.quantity,
      })),
      roomNo: roomNo,
      message: message,
      totalPrice: getCartTotal(cartItems),
    };

    placeOrder(orderDetails, history);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? (
        <div className="cart-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cartItem) => (
                <tr key={cartItem._id}>
                  <td className="product-image">
                    <img alt={cartItem.name} src={cartItem.image} />
                  </td>
                  <td>{cartItem.name}</td>
                  <td>₹{cartItem.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="quantity-button"
                      onClick={() => removeFromCart(cartItem)}
                    >
                      <GrSubtract />
                    </button>
                    {cartItem.quantity}
                    <button
                      className="quantity-button"
                      onClick={() => AddToCart(cartItem)}
                    >
                      <GrAdd />
                    </button>
                  </td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => clearItemFromCart(cartItem._id)}
                    >
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {user?.role === "teacher" && (
        <div className="teacher">
          <h2>Delivery Information</h2>
          <div className="delivery-info">
            <input
              type="text"
              name="roomNo"
              value={roomNo}
              placeholder="Room No"
              onChange={(e) => setRoomNo(e.target.value)}
            />
            <textarea
              placeholder="Enter your message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
      )}
      <div className="cart-total">
        <h3>Total: ₹{getCartTotal(cartItems).toFixed(2)}</h3>
        <button className="order-button" onClick={onSubmit}>
          Place Order
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart.cartItems,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  AddToCart,
  removeFromCart,
  clearItemFromCart,
  placeOrder,
})(CartPage);