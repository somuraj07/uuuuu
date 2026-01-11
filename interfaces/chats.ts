export type AppointmentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Appointment {
  id: string;
  studentId: string;
  teacherId: string;
  teacher:{name:string};
  status: AppointmentStatus;
  note?: string | null;
  studentName?: string; 
  studentClass?: string;
}
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}
