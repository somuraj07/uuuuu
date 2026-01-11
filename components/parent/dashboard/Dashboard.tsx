"use client";

import { useSession } from "next-auth/react";
import Newsfeed from "@/components/schooladmin/newsfeed/Newsfeed";
import ProfileCard from "@/components/ui/common/StudentProfile";
import { Event } from "@/interfaces/student";


export default function ParentDashboard({events,attendanceStats}:{events:Event[],attendanceStats:{present:number,absent:number,late:number,percent:number}}) {
  const { data: session } = useSession();
  
  // Get student name from session
  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email || "";
  const studentClass = studentEmail ? `@${studentEmail.split("@")[0]}` : "@student";

  return (
    <div className="space-y-6">
      
      {/* PROFILE CARD */}
      <ProfileCard
        name={studentName}
        username={studentClass}
        attendance={attendanceStats.present}
        percentage={attendanceStats.percent}
        workshops={events.length}
      />

      {/* NEWSFEED (REUSED COMPONENT) */}
      <section className="bg-white rounded-3xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">
          Newsfeed
        </h2>

        <Newsfeed mode="home" />
      </section>
    </div>
  );
}
