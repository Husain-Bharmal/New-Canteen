import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "../../components/loader/Loader";
import { editFoodItem, getSingleFoodItem } from "../../redux/food/food.actions";
import "./EditFoodPage.css";

const EditFoodPage = ({
  isAuthenticated,
  loading,
  getSingleFoodItem,
  history,
  match,
  food,
  editFoodItem,
}) => {
  const [formData, setFormData] = useState({
    foodType: "",
    name: "",
    price: "",
    quantity: "",
    image: "",
  });

  useEffect(() => {
    getSingleFoodItem(match.params.id);
  }, [getSingleFoodItem, match.params.id]);

  useEffect(() => {
    // Set form data when the food data is available
    if (food) {
      setFormData({
        foodType: food.foodType || "",
        name: food.name || "",
        price: food.price || "",
        quantity: food.quantity || "",
        image: food.image || "",
      });
    }
  }, [food]);

  const { foodType, name, price, quantity, image } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("foodType", foodType);
    formdata.append("name", name);
    formdata.append("price", price);
    formdata.append("quantity", quantity);
    formdata.append("image", image);
    editFoodItem(formdata, match.params.id, history);
  };

  return (
    <div className="root">
      {loading && <Loader />}
      <div className="add-food-div">
        <div>
          <h1>Edit food item</h1>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Name"
              value={name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <br />
            <input
              type="text"
              name="price"
              className="input"
              placeholder="Price"
              value={price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <br />
            <input
              type="text"
              name="quantity"
              className="input"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
            <br />
            <select
              name="foodType"
              value={foodType}
              onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
            >
              <option value="null">Category</option>
              <option value="breakfast">Breakfast</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="chat">Chat</option>
            </select>
            <br />
            <input
              type="file"
              name="image"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
            <br />
            <button>Submit</button>
          </form>
        </div>
        <div>
          <img
            alt="img"
            src={
              typeof image === "object"
                ? URL.createObjectURL(image)
                : image
            }
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.food.loading,
  food: state.food.food,
});

export default connect(mapStateToProps, { getSingleFoodItem, editFoodItem })(
  EditFoodPage
);
