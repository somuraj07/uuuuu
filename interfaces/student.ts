export interface Mark {
  id: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string | null;
  suggestions: string | null;
  createdAt: string;
  class: { id: string; name: string; section: string | null };
  teacher?: { id: string; name: string | null; email: string | null };
}

export interface Attendance {
  id: string;
  date: string;
  period: number;
  status: string;
  class: { id: string; name: string; section: string | null };
  teacher?: { id: string; name: string | null; email: string | null };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  amount: number | null;
  photo: string | null;
  eventDate: string | null;
  class: { id: string; name: string; section: string | null } | null;
  teacher: { id: string; name: string | null; email: string | null };
  _count: { registrations: number };
  isRegistered?: boolean;
  registrationStatus?: string | null;
}

export interface NewsFeed {
  id: string;
  title: string;
  description: string;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  createdBy: { id: string; name: string | null; email: string | null };
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string | null;
  createdAt: string;
  class: { id: string; name: string; section: string | null };
  teacher: { id: string; name: string | null; email: string | null };
  hasSubmitted?: boolean;
  submission?: { id: string; content: string | null; fileUrl: string | null; submittedAt: string } | null;
}

export interface Certificate {
  id: string;
  title: string;
  description: string | null;
  issuedDate: string;
  certificateUrl: string | null;
  template: { id: string; name: string; description: string | null };
  issuedBy: { id: string; name: string | null; email: string | null };
}

export interface TransferCertificate {
  id: string;
  reason: string | null;
  status: string;
  issuedDate: string | null;
  tcDocumentUrl: string | null;
  createdAt: string;
}

/* ------------------ BASE MODELS ------------------ */

export interface StudentFee {
  id: string;
  studentId: string;
  totalFee: number;
  discountPercent: number;
  finalFee: number;
  amountPaid: number;
  remainingFee: number;
  installments: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentUser {
  name: string | null;
  email: string | null;
}

export interface StudentClass {
  name: string;
  section: string | null;
}

export interface SchoolInfo {
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  status: string;
  createdAt: string;
}

export interface StudentFeeApiResponse {
  fee: StudentFee;
  student: StudentUser;
  class: StudentClass | null;
  school: SchoolInfo;
  payments: Payment[];
}


export interface Appointment {
  id: string;
  status: string;
  teacher:{name:string};
  teacherId: string;
  studentId: string;
  note?: string | null;
  requestedAt?: string;
}

export interface FeeReceiptInput {
  payment: {
    id: string;
    amount: number;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    status: string;
    createdAt: string;
  };

  student: {
    name: string | null;
    email: string | null;
  };

  school: {
    name: string;
    address: string;
    city: string | null;
    state: string | null;
    pincode: string | null;
  };
}
