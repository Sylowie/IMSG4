import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../userContext";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { userID } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userID) {
        console.error("userID is undefined in OrderList.jsx");
        setError("User ID is required for fetching orders.");
        return;
      }

      const url = `http://localhost:3002/orders/exportCartData?userID=${userID}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      }
    };

    console.log("userID in OrderList:", userID);

    // Only fetch orders if userID is available
    fetchOrders();
  }, [userID]);


  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name"
            className="p-2 border border-gray-300 rounded-md w-1/4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {orders.map((order) => {
            // Filter items within the order based on the search query
            const filteredItems = order.items.filter((item) =>
              item.Product_Name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Only render orders that have at least one matching item
            if (filteredItems.length === 0) return null;

            return (
              <div
                key={order.OrderID}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">
                  OrderID: {order.OrderID}
                </h3>
                <p>Order Date: {order.Order_Date}</p>
                <p>Delivery Date: {order.Order_Delivery_Date}</p>
                <p>Total Cost: ${order.Order_Cost.toFixed(2)}</p>
                <h4 className="font-semibold mt-2">Items:</h4>
                <ul>
                  {filteredItems.map((item) => (
                    <li key={item.ProductID} className="ml-4">
                      {item.Product_Name} - Quantity: {item.Order_Qty}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrderList;
