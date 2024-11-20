import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartTab from '../components/cartTab';
import { selectIsCartOpen } from '../stores/cart';

const MainLayout = () => {
  const isCartOpen = useSelector(selectIsCartOpen);

  return (
    <>
    <Navbar />
    <div className="flex transition-all duration-500">
      <div
          className={`flex-grow transition-all duration-500 ${isCartOpen ? 'mr-[380px]' : 'mr-0'}`}
          >
        <Outlet />
      </div>
      <CartTab />
    </div>
    </>
  );
};

export default MainLayout;
