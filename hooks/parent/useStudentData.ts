import { useEffect, useState } from "react";
import { useStudentContext } from "@/context/StudentContext";

export function useStudentData<T>(
  fetcher: (studentId: string) => Promise<T>
) {
  const { activeStudent } = useStudentContext();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeStudent) return;

    setLoading(true);
    fetcher(activeStudent.id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [activeStudent?.id]);

  return { data, loading };
}
