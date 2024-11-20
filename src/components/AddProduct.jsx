import React, { useState } from 'react';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    quantity: '',
    category: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3002/products/add', {
        // Replace with your actual backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage('Product added successfully!');
        setFormData({
          name: '',
          description: '',
          cost: '',
          quantity: '',
          category: '',
        });
      } else {
        setStatusMessage('Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setStatusMessage('Error adding product. Please try again later.');
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-md shadow-md mb-10">
  
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block font-semibold">Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Cost:</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600"
        >
          Add Product
        </button>
      </form>
      {statusMessage && (
        <p className="mt-4 text-center text-red-500">{statusMessage}</p>
      )}
    </div>
  );
};

export default AddProduct;
