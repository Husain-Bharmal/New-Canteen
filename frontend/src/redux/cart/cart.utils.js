export const addToCart = (cartItems, cartItemToAdd) => {
  // Check if item already exists using find method
  if (!cartItems) {
    // If cartItems is null or undefined, initialize it as an empty array
    cartItems = [];
  }

  // Check if item already exists using find method
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem._id === cartItemToAdd._id
  );

  // If item already exists, increase quantity
  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem._id === cartItemToAdd._id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...cartItemToAdd, quantity: 1 }];
};

export const removeFromCart = (cartItems, cartItemToRemove) => {
  // Check if item exists using find method
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem._id === cartItemToRemove._id
  );

  // If the quanity is 1, clear it from cart using filter method
  if (existingCartItem.quantity === 1) {
    return cartItems.filter(
      (cartItem) => cartItem._id !== cartItemToRemove._id
    );
  }
  return cartItems.map((cartItem) =>
    cartItem._id === cartItemToRemove._id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

export const getCartTotal = (cartItems) => {
  if (cartItems === null || typeof cartItems !== 'object' || Object.keys(cartItems).length === 0) {
    return 0; // If cartItems is null, not an object, or an empty object, return 0 as the total.
  }

  const sum = Object.values(cartItems).reduce(
    (accumulator, cartItem) => accumulator + cartItem.quantity * cartItem.price,
    0
  );

  return sum;
};

