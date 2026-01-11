import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: Role;
    schoolId?: string | null;
    mobile?: string | null;
    studentId?: string | null;
    subjectsTaught?: string | null;
    schoolIcon?: string | null;
    schoolName?: string | null; // Added to interface
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      schoolId?: string | null;
      mobile?: string | null;
      studentId?: string | null;
      subjectsTaught?: string | null;
      icon?: string | null;
      schoolName?: string | null; // Added to interface
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role;
    schoolId?: string | null;
    mobile?: string | null;
    studentId?: string | null;
    subjectsTaught?: string | null;
    icon?: string | null;
    schoolName?: string | null; // Added to interface
  }
}