"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { MAIN_COLOR, ACCENT_COLOR } from "@/constants/colors";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

interface TimetableEntry {
  id: string;
  dayOfWeek: number;
  period: number;
  subject: string;
  teacher: { name: string | null } | null;
  startTime: string | null;
  endTime: string | null;
}

export default function ParentTimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    // Get student class from API
    fetch("/api/fees/mine")
      .then((res) => res.json())
      .then((data) => {
        if (data.class?.id) {
          setClassId(data.class.id);
          fetchTimetable(data.class.id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchTimetable = async (cid: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/timetable/list?classId=${cid}`);
      const data = await res.json();
      if (res.ok) {
        setTimetable(data.timetables || []);
      }
    } catch (error) {
      console.error("Fetch timetable error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimetableEntry = (day: number, period: number) => {
    return timetable.find((t) => t.dayOfWeek === day && t.period === period);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading timetable...</p>
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-gray-500">Class information not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: MAIN_COLOR }}>
          <Calendar size={24} />
          Class Timetable
        </h1>
        <p className="text-gray-600">View your child's weekly schedule</p>
      </div>

      <div className="glass-card rounded-2xl p-4 md:p-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Period</th>
              {DAYS.map((day, idx) => (
                <th
                  key={idx}
                  className="text-center py-3 px-2 font-semibold text-gray-700 min-w-[120px]"
                >
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period) => (
              <tr key={period} className="border-b last:border-none">
                <td className="py-3 px-2 font-medium text-gray-700 text-center">
                  {period}
                </td>
                {DAYS.map((day, dayIdx) => {
                  const entry = getTimetableEntry(dayIdx, period);
                  return (
                    <td key={dayIdx} className="py-3 px-2 text-center">
                      {entry ? (
                        <div
                          className="glass rounded-lg p-2 border"
                          style={{ borderColor: ACCENT_COLOR }}
                        >
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <BookOpen size={12} style={{ color: MAIN_COLOR }} />
                            <span className="font-medium text-gray-800 text-xs">
                              {entry.subject}
                            </span>
                          </div>
                          {entry.teacher && (
                            <p className="text-xs text-gray-500">{entry.teacher.name}</p>
                          )}
                          {(entry.startTime || entry.endTime) && (
                            <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                              <Clock size={10} />
                              {entry.startTime && entry.endTime
                                ? `${entry.startTime}-${entry.endTime}`
                                : entry.startTime || entry.endTime}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
