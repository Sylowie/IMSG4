import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isCartOpen: false,
};

export const exportCartData = createAsyncThunk(
  "cart/exportCartData",
  async ({ carts, userID }, { dispatch }) => {
    try {
      const response = await fetch(
        "http://localhost:3002/orders/exportCartData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: carts, userID }), 
        }
      );

      console.log("userID in CartTab:", userID);

      if (!response.ok) {
        throw new Error("Failed to export cart data");
      }

      return response.json();
    } catch (error) {
      console.error("Failed to export cart data:", error.message);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { Product_ID, quantity, Product_Qty } = action.payload;
      const existingItem = state.items.find(
        (item) => item.Product_ID === Product_ID
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, Product_Qty });
      }
    },
    increaseQuantity(state, action) {
      const item = state.items.find(
        (item) => item.Product_ID === action.payload
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(state, action) {
      const item = state.items.find(
        (item) => item.Product_ID === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeFromCart(state, action) {
      const Product_ID = action.payload;
      state.items = state.items.filter(
        (item) => item.Product_ID !== Product_ID
      );
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    clearCart(state) {
      state.items = []; // Clear all items from the cart
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  toggleCart,
  clearCart,
} = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
export default cartSlice.reducer;
