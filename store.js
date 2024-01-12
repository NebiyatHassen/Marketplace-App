// store.js
import { createStore } from "redux";

const initialState = {
  products: [], // Initial state for products
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    // Add other cases for different actions if needed
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
