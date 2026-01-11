import { api } from "../api";

export const getTeachers = () => api("/api/teacher/list");


export const createTeacher = (payload: {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}) =>
  api("/api/teacher/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });