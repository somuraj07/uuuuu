import { NewsFeed } from "@/interfaces/student";
import { apiJson } from "../api";

// helper – future-proof
const withStudent = (url: string, studentId?: string) => {
  if (!studentId) return url;

  const hasQuery = url.includes("?");
  return hasQuery
    ? `${url}&studentId=${studentId}`
    : `${url}?studentId=${studentId}`;
};


export const parentApi = {
  homeworks: (studentId?: string) =>
    apiJson<{ homeworks: any[] }>(
      withStudent("/api/homework/list", studentId)
    ),

  attendance: (studentId?: string) =>
    apiJson<{ attendances: any[] }>(
      withStudent("/api/attendance/view", studentId)
    ),

  marks: (studentId?: string) =>
    apiJson<{ marks: any[] }>(
      withStudent("/api/marks/view", studentId)
    ),

  events: (studentId?: string) =>
    apiJson<{ events: any[] }>(
      withStudent("/api/events/list", studentId)
    ),

  certificates: (studentId?: string) =>
    apiJson<{ certificates: any[] }>(
      withStudent("/api/certificates/list", studentId)
    ),

  fees: (studentId?: string) =>
    apiJson<{ fee: any }>(
      withStudent("/api/fees/mine", studentId)
    ),

  appointments: () =>
    apiJson<{ appointments: any[] }>("/api/communication/appointments"),

  news:()=>
    apiJson<{ news:any}>("/api/newsfeed/list"),

  homeworkSubmit: (payload: {
    homeworkId: string;
    content?: string;
    fileUrl?: string;
  }) =>
    apiJson<{ message: string; submission: any }>(
      "/api/homework/submit",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

};
