import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";
import carticon from "../assets/images/carticon.png";
import { toggleCart } from "../stores/cart";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "../userContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const { userRole } = useContext(UserContext);

  const handleCartToggle = () => {
    dispatch(toggleCart());
  };
  const [totalQuantity, setTotalQuantity] = useState(0);
  const carts = useSelector((store) => store.cart.items);
  useEffect(() => {
    let total = 0;
    carts.forEach((item) => (total += item.quantity));
    setTotalQuantity(total);
  }, [carts]);

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-black-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* Logo */}
            <NavLink
              className="flex flex-shrink-0 items-center mr-4"
              to="/home"
            >
              <img
                className="h-10 w-auto"
                src={logo}
                alt="Inventory Management System"
              />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                Inventory Management System
              </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                {userRole === "customer" ? (
                  <>
                    <NavLink to="/products" className={linkClass}>
                      Products
                    </NavLink>
                    <NavLink to="/orders" className={linkClass}>
                      Orders
                    </NavLink>
                    <NavLink to="/logout" className={linkClass}>
                      Logout
                    </NavLink>
                    <button
                      onClick={handleCartToggle}
                      className="relative flex items-center justify-center w-10 h-10 border-2 border-white bg-white rounded-full"
                    >
                      <img src={carticon} alt="Cart" className="w-7 h-7" />
                      <span className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center">
                        {totalQuantity}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/products" className={linkClass}>
                      Products
                    </NavLink>
                    <NavLink to="/reports" className={linkClass}>
                      Reports
                    </NavLink>
                    <NavLink to="/register" className={linkClass}>
                      Register New User
                    </NavLink>
                    <NavLink to="/logout" className={linkClass}>
                      Logout
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
