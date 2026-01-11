import { api } from "../api";

export const getClasses = () => api("/api/class/list");
