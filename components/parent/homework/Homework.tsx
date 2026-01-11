"use client";

import HomeworkSkeleton from "@/components/parent/homework/HomeworkSkeleton";
import HomeworkCard from "@/components/parent/homework/homeworkcard";
import { HiSparkles } from "react-icons/hi2";

export default function HomeworkPage({homeworks,loading,reloadHomework}: {homeworks: any[]; loading: boolean; reloadHomework: ()=>void}) {

[{
	"resource": "/d:/Timellyschool/shradhaatimelly/app/pages/parent/dashboard/Dashboard.tsx",
	"owner": "typescript",
	"code": "2741",
	"severity": 8,
	"message": "Property 'homework' is missing in type '{}' but required in type '{ homework: any; }'.",
	"source": "ts",
	"startLineNumber": 24,
	"startColumn": 17,
	"endLineNumber": 24,
	"endColumn": 31,
	"relatedInformation": [
		{
			"startLineNumber": 10,
			"startColumn": 54,
			"endLineNumber": 10,
			"endColumn": 62,
			"message": "'homework' is declared here.",
			"resource": "/d:/Timellyschool/shradhaatimelly/components/parent/homework/Homework.tsx"
		}
	],
	"origin": "extHost1"
}]


  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
          <HiSparkles className="text-green-600" /> Assignments Overview
        </span>

        <h1 className="text-2xl md:text-3xl font-bold mt-3">Homework</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Track assignments, deadlines, and submission status in one place.
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <>
            <HomeworkSkeleton />
            <HomeworkSkeleton />
          </>
        ) : homeworks.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            No homework assigned 🎉
          </p>
        ) : (
          homeworks.map((hw) => (
            <HomeworkCard key={hw.id} homework={hw} reloadHomework={reloadHomework} />
          ))
        )}
      </div>
    </div>
  );
}
