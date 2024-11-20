import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const formData = {
        email,
        password,
        role,
        firstName,
        lastName,
        contact,
        companyName: role === 'customer' ? companyName : null,
      };

      const response = await fetch("http://localhost:3002/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        //window.location.href = "/login";
      } else {
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register. Please try again later.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Registration Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-semibold mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Mobile</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Mobile"
            pattern="\d{8}"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {role === 'customer' && (
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2 mt-4 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Register;
