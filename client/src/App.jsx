import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import StudentMangement from "./pages/StudentMangement";
import EmployeeMangement from "./pages/EmployeeMangement";
import TaskTracker from "./pages/TaskTracker";
import ExpenseTracker from "./pages/ExpenseTracker";
import ProductInventory from "./pages/ProductInventory";
import Authentication from "./pages/Authentication";

import ProtectedRoute from "./component/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      
      />

   
      <Routes>
        <Route path="/" element={<Authentication />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentMangement />
            </ProtectedRoute>
          }
        />

        <Route path="/employee" element={<EmployeeMangement />} />
        <Route path="/task" element={<TaskTracker />} />
        <Route path="/expense" element={<ExpenseTracker />} />
        <Route path="/product" element={<ProductInventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
