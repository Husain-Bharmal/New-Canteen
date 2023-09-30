const express = require("express");
const Order = require("../models/order.models");
const User = require("../models/auth.models");
const Food = require("../models/food.models");
const router = express.Router();
const auth = require("../middleware/auth");

// get admin orders : GET (private)
router.get("/orders", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      const orders = await Order.find({ paymentStatus: false })
        .populate("user", "name branch role")
        .sort("-date");
      res.json({ data: orders });
    } else {
      return res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// get user(my) orders : GET (private)
router.get("/myorders", auth, async (req, res) => {
  try {
    const result = await Order.find({ user: req.user.id }).sort("-date");
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// post orders : POST (private)
router.post("/place/order", auth, async (req, res) => {
  try {
    const user = req.user.id;
    // Assuming req.body.cart is an array of objects with food item details, including the food ID and quantity
    const orderItems = req.body.cart;

    // Initialize an array to store promises for updating food quantities
    const updateFoodQuantityPromises = [];

    // Loop through order items and create promises to update food quantities
    orderItems.forEach((item) => {
      const foodId = item.foodId; 
      const quantity = item.quantity;
      // Assuming you have a Food model/schema
      // Update the food quantity by decrementing it based on the quantity in the order
      const updateFoodQuantityPromise = Food.findByIdAndUpdate(
        foodId,
        { $inc: { quantity: -quantity } }, // Decrement the quantity
        { new: true } // Return the updated food item
      );

      updateFoodQuantityPromises.push(updateFoodQuantityPromise);
    });

    // Wait for all update promises to resolve
    const updatedFoods = await Promise.all(updateFoodQuantityPromises);

    // Create the order and save it
    const order = new Order({
      user,
      orders: req.body.cart,
      totalPrice: req.body.totalPrice,
      roomNo: req.body.roomNo,
      message: req.body.message ? req.body.message : "",
      paymentType: "",
    });

    await order.save();

    res.json({ order, updatedFoods }); // Send back the order and updated food items
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// Update order status : PUT (private)
router.put("/orders/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isAdmin) {
      const order = await Order.findOneAndUpdate(
        { _id: req.params.id },
        { isConfirmed: req.body.isConfirmed },
        { new: true }
      );
      res.json({ data: order });
    } else {
      return res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// set payment type :  PUT (private)

router.put("/order/payment-type/:id", auth, async (req, res) => {
  try {
    const { paymentType } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { paymentType },
      { new: true }
    );

    res.json({ data: order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Payment : PUT (private)
router.put("/payment-status/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { paymentStatus: true },
      { new: true }
    );

    res.json({ data: order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
