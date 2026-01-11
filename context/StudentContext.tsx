"use client";

import { createContext, useContext, useState } from "react";

export type Student = {
  id: string;
  name: string;
};

type StudentContextType = {
  students: Student[];
  activeStudent: Student | null;
  setActiveStudent: (s: Student) => void;
  setActiveStudentId: (id: string) => void;
};

const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students] = useState<Student[]>([
    { id: "session-student", name: "My Child" },
  ]);

  const [activeStudent, setActiveStudent] = useState<Student | null>(
    students[0]
  );

  const setActiveStudentId = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) setActiveStudent(student);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        activeStudent,
        setActiveStudent,
        setActiveStudentId,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}


export const useStudentContext = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("StudentContext missing");
  return ctx;
};
