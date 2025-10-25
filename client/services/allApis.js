import { data } from "react-router";
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