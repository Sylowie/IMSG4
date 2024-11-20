import React, { useState, useEffect } from "react";
import CustomerList from "./CustomerList";

const CustomerListings = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:3002/customer/all");
        if (!response.ok) {
          throw new Error(`Server Error: ${response.statusText}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.Fname.toLowerCase().includes(query) ||
      customer.Lname.toLowerCase().includes(query) ||
      customer.Email.toLowerCase().includes(query) ||
      (customer.Company_Name && customer.Company_Name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-2/3">
        <h1 className="text-2xl font-bold mb-4">Customer Listings</h1>

        <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-1/4"
        />
        </div>

        <div className="customer-listings grid grid-cols-1 lg:grid-cols-1 gap-6">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <CustomerList
                key={customer.UserID}
                customer={customer}
                setCustomers={setCustomers}
                customers={customers}
              />
            ))
          ) : (
            <p>No customers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerListings;
