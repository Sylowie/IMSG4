import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider, UserContext } from "./userContext";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import CustomerPage from "./pages/CustomerPage";
import RegisterPage from "./pages/RegisterPage";
import CartTab from "./components/cartTab";
import OrderList from "./components/OrderList";

// ProtectedRoute component that handles authentication and role-based access
const ProtectedRoute = ({ requiredRole, children }) => {
  const { userRole, isAuthenticated } = useContext(UserContext);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Display loading while checking auth
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" />; // Redirect if userRole doesn't match
  }

  return children;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Redirect root to /home if authenticated, otherwise to /login */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/home" />
              </ProtectedRoute>
            }
          />
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<LogoutPage />} />
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <CartTab />{" "}
                {/* CartTab is globally accessible on all pages within MainLayout */}
              </MainLayout>
            }
          >
            {" "}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Orders"
              element={
                <ProtectedRoute>
                  <OrderList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute requiredRole="admin">
                  <RegisterPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CustomerPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback route for unknown URLs */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
