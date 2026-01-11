import { api } from "./api";

export const StudentAPI = {
  attendance: (studentId: string, params = "") =>
    api(`/api/attendance?studentId=${studentId}&${params}`),

  homework: (studentId: string) =>
    api(`/api/homeworks?studentId=${studentId}`),

  marks: (studentId: string) =>
    api(`/api/marks?studentId=${studentId}`),

  fees: (studentId: string) =>
    api(`/api/fees/${studentId}`),

  certificates: (studentId: string) =>
    api(`/api/certificates?studentId=${studentId}`),

  appointments: (studentId: string) =>
    api(`/api/appointments?studentId=${studentId}`),
};
