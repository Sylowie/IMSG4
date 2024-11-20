import React, { useContext, useState, useEffect } from 'react';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import { UserContext } from '../userContext';

const ProductListings = ({ isHome = false }) => {
  const { userRole } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3002/products/all');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const productListings = isHome
    ? products.filter(product => product.Product_Qty < 2)
    : [...products].sort((a, b) => a.Product_Qty - b.Product_Qty);

    const displayedProducts = searchQuery
    ? productListings.filter((product) =>
        product.Product_Name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productListings;

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? 'Products Low In-Stock' : 'All Product Inventory'}
        </h2>
        

        {userRole === 'admin' && (
          <>
            <button
              onClick={handleToggleForm}
              className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 mb-6"
            >
              {showForm ? 'Close' : 'Add Product'}
            </button>

            {showForm && (
              <div className="mb-10">
                <AddProduct />
              </div>
            )}
          </>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-1/4"
        />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedProducts.map((product) => (
            <ProductList key={product.Product_ID} product={product} userRole={userRole} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductListings;
