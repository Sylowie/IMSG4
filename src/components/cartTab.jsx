import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectIsCartOpen,
  toggleCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  exportCartData,
  clearCart,
} from "../stores/cart";
import { UserContext } from "../userContext";

const CartTab = () => {
  const carts = useSelector(selectCartItems);
  const isCartOpen = useSelector(selectIsCartOpen);
  const dispatch = useDispatch();
  const { userID } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [animateTotal, setAnimateTotal] = useState(false);

  const handleClose = () => {
    dispatch(toggleCart());
  };

  const handleIncreaseQuantity = (Product_ID, Product_Qty, quantity) => {
    if (quantity < Product_Qty) {
      dispatch(increaseQuantity(Product_ID));
    } else {
      alert("No more stock available");
    }
  };

  const handleDecreaseQuantity = (Product_ID) => {
    dispatch(decreaseQuantity(Product_ID));
  };

  const handleRemoveItem = (Product_ID) => {
    dispatch(removeFromCart(Product_ID));
  };

  const handleCheckout = () => {
    setShowModal(true);
  };

  const confirmCheckout = () => {
    if (userID) {
      // Dispatch exportCartData with cart items and userID as payload
      dispatch(exportCartData({ carts, userID })).then(() => {
        dispatch(clearCart()); // Clear cart after export
        setShowModal(false);
        window.location.reload();
      });
    } else {
      console.error("userID is missing in CartTab"); //debug
    }
  };

  const cancelCheckout = () => {
    setShowModal(false);
  };

  const totalCartCost = carts.reduce(
    (acc, item) => acc + item.Product_Cost * item.quantity,
    0
  );

  useEffect(() => {
    setAnimateTotal(true);
    const timer = setTimeout(() => setAnimateTotal(false), 300);
    return () => clearTimeout(timer);
  }, [totalCartCost]);

  return (
    <div
      className={`fixed top-0 right-0 w-1/5 h-full bg-gray-700 p-5 transition-transform duration-500 transform ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="mb-4">
              Are you sure you want to submit your order?
            </div>
            <div className="flex justify-between">
              <button
                onClick={confirmCheckout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded mr-4"
              >
                Confirm
              </button>
              <button
                onClick={cancelCheckout}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-white text-2xl flex justify-between items-center">
        Shopping Cart
        {carts.length > 0 && (
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#d14545",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              opacity: animateTotal ? 0.7 : 1,
              transform: animateTotal ? "scale(1.2)" : "scale(1)",
            }}
          >
            Total: ${totalCartCost.toFixed(2)}
          </span>
        )}
      </h2>

      <div className="p-5 overflow-y-auto h-[calc(100%-100px)]">
        {carts.length > 0 ? (
          carts.map((item, key) => (
            <div
              key={key}
              className="mb-4 text-white border border-gray-500 p-3 rounded"
            >
              <h3 className="font-semibold">{item.Product_Name}</h3>
              <p>Product ID: {item.Product_ID}</p>
              <p>Price per unit: ${item.Product_Cost}</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleDecreaseQuantity(item.Product_ID)}
                  className={`h-8 w-8 font-bold text-xl rounded flex justify-center items-center bg-gray-300 ${
                    item.quantity <= 1
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-400"
                  }`}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="border h-8 w-16 text-center text-lg mx-2 rounded-md bg-white text-black"
                  value={item.quantity}
                  readOnly
                />
                <button
                  onClick={() =>
                    handleIncreaseQuantity(
                      item.Product_ID,
                      item.Product_Qty,
                      item.quantity
                    )
                  }
                  className={`h-8 w-8 font-bold text-xl rounded flex justify-center items-center ${
                    item.quantity >= item.Product_Qty
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  disabled={item.quantity >= item.Product_Qty}
                >
                  +
                </button>
              </div>
              <p className="text-white mt-2">
                Total: ${(item.Product_Cost * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemoveItem(item.Product_ID)}
                className="mt-2 text-red-500 hover:text-red-600"
              >
                Remove Item
              </button>
            </div>
          ))
        ) : (
          <p className="text-white">Your cart is empty.</p>
        )}
      </div>

      <div className="p-5 absolute bottom-0 w-full flex justify-between space-x-2">
        <button
          onClick={handleClose}
          className="bg-black text-white w-full py-3 text-lg rounded"
        >
          Close
        </button>
        {carts.length > 0 && (
          <button
            onClick={handleCheckout}
            className="bg-amber-600 text-white w-full py-3 text-lg rounded ml-2"
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartTab;
