import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/authSlice";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateProductForm from "./components/CreateProductForm";

import TaskListPage from "./pages/TaskListPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import CreateTaskForm from "./components/CreateTaskForm";

import LoginPage from "./pages/LoginPage"; // ✅ ADDED: Import login page

import "./App.css";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="app-layout">
      <Header />

      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <ProductListPage />
          </ProtectedRoute>
        } />

        <Route path="/products/new" element={
          <ProtectedRoute>
            <CreateProductForm />
          </ProtectedRoute>
        } />

        <Route path="/products/:id" element={
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        } />

        <Route path="/tasks/new" element={
          <ProtectedRoute>
            <CreateTaskForm />
          </ProtectedRoute>
        } />

        <Route path="/tasks/:id" element={
          <ProtectedRoute>
            <TaskDetailPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;