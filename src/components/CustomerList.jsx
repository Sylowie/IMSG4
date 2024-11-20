import React, { useState } from "react";

const CustomerList = ({ customer, customers, setCustomers }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [updatedCustomer, setUpdatedCustomer] = useState({
    Fname: customer.Fname || "",
    Lname: customer.Lname || "",
    Email: customer.Email || "",
    Contact: customer.Contact || "",
    Company_Name: customer.Company_Name || "",
  });

  const { UserID, Fname, Lname, Email, Contact, Company_Name } = customer;

  const handleUpdateCustomer = () => {
    setShowUpdateModal(true);
  };

  const handleDeleteCustomer = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Customer ID ${UserID}?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3002/customer/delete/${UserID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Customer with ID ${UserID} deleted successfully.`);
        setCustomers(customers.filter((c) => c.UserID !== UserID));
      } else {
        console.error(`Failed to delete customer with ID ${UserID}.`);
      }
    } catch (error) {
      console.error(`Error deleting customer with ID ${UserID}:`, error);
    }
  };

  const handleUpdateSubmit = async () => {
    const formattedCustomer = {
      Fname: updatedCustomer.Fname,
      Lname: updatedCustomer.Lname,
      Email: updatedCustomer.Email,
      Contact: updatedCustomer.Contact,
      Company_Name: updatedCustomer.Company_Name,
    };

    try {
      const response = await fetch(
        `http://localhost:3002/customer/update/${UserID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedCustomer),
        }
      );

      if (response.ok) {
        console.log(`Customer with ID ${UserID} updated successfully.`);
        setShowUpdateModal(false); 
        
        // Display a success notification
        window.alert("Customer updated successfully!");
      } else {
        console.error(
          `Failed to update customer with ID ${UserID}.`,
          await response.text()
        );
      }
    } catch (error) {
      console.error(`Error updating customer with ID ${UserID}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCustomer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {Fname} {Lname}
        </h3>
        <p className="text-gray-600"><strong>Email:</strong> {Email}</p>
        <p className="text-gray-600"><strong>Contact:</strong> {Contact}</p>
        {Company_Name && (
          <p className="text-gray-600"><strong>Company:</strong> {Company_Name}</p>
        )}
      </div>

      <div className="flex flex-col space-y-2 ml-4">
        <button
          onClick={handleUpdateCustomer}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Update Customer
        </button>
        <button
          onClick={handleDeleteCustomer}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Delete Customer
        </button>
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Update Customer</h2>
            <input
              type="text"
              name="Fname"
              value={updatedCustomer.Fname}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="First Name"
            />
            <input
              type="text"
              name="Lname"
              value={updatedCustomer.Lname}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Last Name"
            />
            <input
              type="email"
              name="Email"
              value={updatedCustomer.Email}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Email"
            />
            <input
              type="text"
              name="Contact"
              value={updatedCustomer.Contact}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Contact"
            />
            <input
              type="text"
              name="Company_Name"
              value={updatedCustomer.Company_Name}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              placeholder="Company Name"
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

export default CustomerList;
