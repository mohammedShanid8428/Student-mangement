// import { data } from "react-router";
import { base_url } from "./base_url";
import commonApi from "./commonApi";

export const createStudent = async (data) =>
  await commonApi(`${base_url}/student`, "POST", null, data);

export const getAllStudent = async () =>
  await commonApi(`${base_url}/student`, "GET");

export const updateStudent = async (id, data) =>
  await commonApi(`${base_url}/student/${id}`, "PUT", null, data);

export const deleteStudent = async (id) =>
  await commonApi(`${base_url}/student/${id}`, "DELETE");

export const createEmployee = async (data) =>
  await commonApi(`${base_url}/employee`, "POST", null, data);

export const getAllEmployees = async () =>
  await commonApi(`${base_url}/employee`, "GET");

export const updateEmployee = async (id, data) =>
  await commonApi(`${base_url}/employee/${id}`, "PUT", null, data);

export const deleteEmployee = async (id) =>
  await commonApi(`${base_url}/employee/${id}`, "DELETE");

export const createTask = async (data) =>
  await commonApi(`${base_url}/task`, "POST", null, data);

export const getTasks = async () =>
  await commonApi(`${base_url}/task`, "GET");

export const updateTask = async (id, data) =>
  await commonApi(`${base_url}/task/${id}`, "PUT", null, data);

export const deleteTask = async (id) =>
  await commonApi(`${base_url}/task/${id}`, "DELETE");

export const createExpense = async (data) =>
  await commonApi(`${base_url}/expense`, "POST", null, data);

// 📄 Get all expenses (optional filters)
export const getAllExpenses = async (query = "") =>
  await commonApi(`${base_url}/expense${query ? `?${query}` : ""}`, "GET");

// ✏️ Update expense
export const updateExpense = async (id, data) =>
  await commonApi(`${base_url}/expense/${id}`, "PUT", null, data);

// ❌ Delete expense
export const deleteExpense = async (id) =>
  await commonApi(`${base_url}/expense/${id}`, "DELETE");

// 💰 Get total expenses
export const getTotalExpenses = async () =>
  await commonApi(`${base_url}/expense/total`, "GET");

export const createProduct = async (data) =>
  await commonApi(`${base_url}/product`, "POST", null, data);

export const getAllProducts = async (query = "") =>
  await commonApi(`${base_url}/product${query}`, "GET");

export const updateProduct = async (id, data) =>
  await commonApi(`${base_url}/product/${id}`, "PUT", null, data);

export const deleteProduct = async (id) =>
  await commonApi(`${base_url}/product/${id}`, "DELETE");

export const getTotalStockValue = async () =>
  await commonApi(`${base_url}/product/total`, "GET");


export const registerUser = (data) => commonApi(`${base_url}/register`, "POST", null, data);
export const loginUser = (data) => commonApi(`${base_url}/login`, "POST", null, data);
export const getProfile = () => commonApi(`${base_url}/profile`, "GET");