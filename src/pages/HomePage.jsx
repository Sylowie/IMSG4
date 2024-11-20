import React, { useContext } from 'react';
import HomeCards_admin from '../components/HomeCards_admin';
import ProductListings from '../components/ProductListings';
import ViewAllProducts from '../components/ViewAllProducts';
import { UserContext } from '../userContext'; // Import UserContext to access userRole

const HomePage = () => {
  const { userRole } = useContext(UserContext); // Access userRole from context

  return (
    <>
      {userRole === 'admin' && <HomeCards_admin />}
      <ProductListings isHome={true} />
      <ViewAllProducts />
    </>
  );
};

export default HomePage;
