"use client";

import ParentBarChart from "@/components/parent/marks/ParentBarChart";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Award, TrendingUp, BarChart3, Icon } from "lucide-react";

interface SubjectMark {
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
  suggestions?: string;
}

interface ClassStudentTotal {
  studentId: string;
  totalObtained: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const hoverPop = {
  whileHover: {
    scale: 1.03,
    transition: { duration: 0.2 },
  },
};

export default function ParentMarks() {
  const [marks, setMarks] = useState<SubjectMark[]>([]);
  const [classTotals, setClassTotals] = useState<ClassStudentTotal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marks/view")
      .then((res) => res.json())
      .then((data) => {
        setMarks(data.marks || []);
        setClassTotals(data.classTotals || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading marks...</div>;
  }

  const totalSubjects = marks.length;

  const totalObtained = marks.reduce((sum, m) => sum + m.marks, 0);
  const totalMaxMarks = marks.reduce((sum, m) => sum + m.totalMarks, 0);

  const overall = Math.round(
    (totalObtained / totalMaxMarks) * 100
  );

  const betterStudentsCount = classTotals.filter(
    (s) => s.totalObtained > totalObtained
  ).length;

  const rank = betterStudentsCount + 1;
  const classStrength = classTotals.length;

  const chartData = marks.map((m) => ({
    label: m.subject,
    value: Math.round((m.marks / m.totalMarks) * 100),
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >

      <motion.div
        variants={itemVariants}
        {...hoverPop}
        className="rounded-2xl p-6 shadow-sm
          bg-gradient-to-br from-green-100 via-white to-green-100"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div
            className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center"
          >
            <Award className="text-green-600" size={30} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Marks
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          A composed view of academic performance and growth.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatCard
          label="Overall"
          value={`${overall}%`}
          icon={Award}
        />

        <StatCard
          label="Rank"
          value={`${rank} / ${classStrength}`}
          icon={TrendingUp}
        />

        <StatCard
          label="Subjects"
          value={totalSubjects}
          icon={BarChart3}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        {...hoverPop}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h2 className="font-semibold text-gray-800 mb-4">
          Performance Overview
        </h2>

        <ParentBarChart data={chartData} yDomain={[0, 100]} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-6 shadow-sm
          bg-gradient-to-br from-green-100 via-white to-green-100"
      >
        <h2 className="font-semibold text-gray-800 mb-6">
          Subject-wise Performance
        </h2>

        <div className="space-y-4">
          {marks.map((m) => {
            const percent = Math.round(
              (m.marks / m.totalMarks) * 100
            );

            return (
              <motion.div
                key={m.subject}
                {...hoverPop}
                className="rounded-xl p-4 shadow-sm
                  bg-gradient-to-br from-green-50 via-white to-green-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {m.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {m.suggestions || "Keep improving"}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    {m.grade}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {percent}% achieved
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: any; icon: React.ElementType; }) {
  return (
    <motion.div
      {...hoverPop}
      className="rounded-xl p-5 shadow-sm
      bg-gradient-to-br from-green-50 via-white to-green-50"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
          <Icon className="text-green-600" size={28} />
        </div>

        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
