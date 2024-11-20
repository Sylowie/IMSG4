import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../stores/cart";
import CartTab from "./cartTab";

const ProductList = ({ product, userRole }) => {
  const carts = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const [updatedProduct, setUpdatedProduct] = useState({
    Product_Name: product.Product_Name || "",
    Product_Description: product.Product_Description || "",
    Product_Cost: product.Product_Cost || 0,
    Product_Qty: product.Product_Qty || 0,
    Product_Category: product.Product_Category || "",
  });

  if (!product) {
    return <div>Error: Product data is missing</div>;
  }

  //updated to reference the DB field instead of json file
  const {
    Product_ID,
    Product_Name,
    Product_Description,
    Product_Cost,
    Product_Qty,
  } = product;

  const [quantity, setQuantity] = useState(1);

  const [showStockAlert, setShowStockAlert] = useState(false); // State for stock alert modal
  const currentCartItem = carts.find((item) => item.Product_ID === Product_ID);
  const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const handleMinusQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1)); // Prevents quantity from going below 1
  };

  const handlePlusQuantity = () => {
    if (quantity + currentCartQuantity < Product_Qty) {
      setQuantity((prev) => prev + 1);
    } else {
      setShowStockAlert(true); // Show modal if quantity exceeds stock
    }
  };
  const handleAddToCart = () => {
    if (quantity + currentCartQuantity <= Product_Qty) {
      dispatch(
        addToCart({
          Product_ID,
          Product_Name,
          Product_Cost,
          Product_Qty,
          quantity,
        })
      );
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 1500);
    } else {
      setShowStockAlert(true); // Show modal if quantity exceeds stock
    }
  };

  const closeStockAlert = () => {
    setShowStockAlert(false);
  };
  const handleUpdateProduct = async () => {
    setShowUpdateModal(true);
  };

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Product ID ${Product_ID}?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3002/products/delete/${Product_ID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Product with ID ${Product_ID} deleted successfully.`);
      } else {
        console.error(`Failed to delete product with ID ${Product_ID}.`);
      }
    } catch (error) {
      console.error(`Error deleting product with ID ${Product_ID}:`, error);
    }
  };

  const handleUpdateSubmit = async () => {
    const formattedProduct = {
      name: updatedProduct.Product_Name,
      description: updatedProduct.Product_Description,
      cost: updatedProduct.Product_Cost,
      quantity: updatedProduct.Product_Qty,
      category: updatedProduct.Product_Category,
    };

    try {
      const response = await fetch(
        `http://localhost:3002/products/update/${Product_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedProduct),
        }
      );

      if (response.ok) {
        console.log(`Product with ID ${Product_ID} updated successfully.`);
        setShowUpdateModal(false); // Close the modal after a successful update
      } else {
        console.error(
          `Failed to update product with ID ${Product_ID}.`,
          await response.text()
        );
      }
    } catch (error) {
      console.error(`Error updating product with ID ${Product_ID}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md relative">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {Product_Name}
          </h3>
          <p className="text-gray-600">{Product_Description}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-indigo-500">
            ${Product_Cost}
          </span>
          <span className="text-gray-500">Qty: {Product_Qty}</span>
        </div>

        {userRole === "admin" ? (
          <div className="mt-4 space-y-2">
            <button
              onClick={handleUpdateProduct}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Update Product
            </button>
            <button
              onClick={handleDeleteProduct}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Delete Product
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <button
                className="bg-gray-100 h-10 w-10 font-bold text-xl rounded-xl flex justify-center items-center"
                onClick={handleMinusQuantity}
              >
                -
              </button>
              <input
                type="number"
                className="border h-10 w-20 text-center text-lg rounded-md"
                value={quantity}
                min="1"
                max={Product_Qty} // Limit to available stock
                onChange={(e) => {
                  const inputQty = Math.max(
                    1,
                    Math.min(Product_Qty, Number(e.target.value))
                  ); // Constrain within stock limits
                  setQuantity(inputQty);
                }}
              />
              <button
                className="bg-gray-100 h-10 w-10 font-bold text-xl rounded-xl flex justify-center items-center"
                onClick={handlePlusQuantity}
                disabled={quantity >= Product_Qty}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 ${
                quantity > Product_Qty ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={quantity > Product_Qty}
            >
              Add to Cart
            </button>
          </>
        )}
      </div>
      <CartTab />
      {showAddedMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-3 px-6 rounded-lg shadow-xl text-xl font-semibold">
          Item Added Successfully!
        </div>
      )}
      {showStockAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              No More Stock
            </h2>
            <p className="text-gray-700 mb-4">
              You cannot add more items than are in stock.
            </p>
            <button
              onClick={closeStockAlert}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Update Product</h2>
            <input
              type="text"
              name="Product_Name"
              value={updatedProduct.Product_Name}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Product Name"
            />
            <textarea
              name="Product_Description"
              value={updatedProduct.Product_Description}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Product Description"
            />
            <input
              type="number"
              name="Product_Cost"
              value={updatedProduct.Product_Cost}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Product Cost"
            />
            <input
              type="number"
              name="Product_Qty"
              value={updatedProduct.Product_Qty}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Product Quantity"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
