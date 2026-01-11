"use client";

import AnimatedCard from "@/components/ui/common/AnimatedCard";
import PageHeader from "@/components/ui/common/PageHeader";
import SelectField from "@/components/ui/common/SelectField";
import EmptyFeeState from "@/components/ui/fee/EmptyFeeState";
import FeeDetails from "@/components/ui/fee/FeeDetails";
import FeeStats from "@/components/ui/fee/FeeStats";
import { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import { MAIN_COLOR } from "@/constants/colors";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/services/toast/toast.service";

export default function FeePaymentsPage({
  classes,
  fees,
  stats,
}: {
  classes: any[];
  fees: any[];
  stats: any;
}) {
  const [selectedClass, setSelectedClass] = useState("");

  const filteredFees = useMemo(() => {
    if (!selectedClass) return [];
    return fees.filter((fee) => fee.student.class?.id === selectedClass);
  }, [fees, selectedClass]);

  const classStats = useMemo(() => {
    if (!selectedClass) return null;

    const totalStudents = filteredFees.length;
    let paid = 0;
    let pending = 0;
    let totalCollected = 0;
    let totalDue = 0;

    filteredFees.forEach((fee) => {
      totalCollected += fee.amountPaid;
      totalDue += fee.remainingFee;

      if (fee.remainingFee <= 0) {
        paid += 1;
      } else {
        pending += 1;
      }
    });

    return {
      totalStudents,
      paid,
      pending,
      totalCollected,
      totalDue,
    };
  }, [filteredFees, selectedClass]);

  const slideFromLeft: Variants = {
    hidden: {
      opacity: 0,
      x: -40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const handleDownloadPDF = () => {
    if (!selectedClass || !classStats) {
      toast.error("Please select a class to generate the report.");
      return
    };

    const doc = new jsPDF("p", "mm", "a4");

    const selectedClassObj = classes.find((c) => c.id === selectedClass);

    /* ---------------- HEADER ---------------- */
    doc.setFontSize(16);
    doc.text("Fee Payment Report", 14, 18);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(
      `Class: ${selectedClassObj?.name} - ${selectedClassObj?.section}`,
      14,
      26
    );
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    /* ---------------- SUMMARY ---------------- */
    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("Summary", 14, 44);

    autoTable(doc, {
      startY: 48,
      head: [["Total Students", "Paid", "Pending", "Collected (₹)", "Due (₹)"]],
      body: [
        [
          classStats.totalStudents,
          classStats.paid,
          classStats.pending,
          classStats.totalCollected.toLocaleString(),
          classStats.totalDue.toLocaleString(),
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [67, 183, 113], // matches MAIN_COLOR
        textColor: 255,
      },
    });

    /* ---------------- DETAILS TABLE ---------------- */
    doc.setFontSize(13);
    doc.text("Student Fee Details", 14, (doc as any).lastAutoTable.finalY + 12);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [
        [
          "Student Name",
          "Total Fee",
          "Discount %",
          "Paid (₹)",
          "Remaining (₹)",
          "Status",
        ],
      ],
      body: filteredFees.map((fee) => [
        fee.student.user?.name ?? "-",
        fee.totalFee,
        fee.discountPercent,
        fee.amountPaid,
        fee.remainingFee,
        fee.remainingFee <= 0 ? "PAID" : "PENDING",
      ]),
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
      },
      didParseCell: function (data) {
        // Status column = index 5
        if (data.section === "body" && data.column.index === 5) {
          if (data.cell.raw === "PAID") {
            data.cell.styles.textColor = [0, 150, 0];
          } else {
            data.cell.styles.textColor = [200, 0, 0];
          }
        }
      },
    });

    /* ---------------- SAVE ---------------- */
    doc.save(
      `Fee_Report_${selectedClassObj?.name}_${selectedClassObj?.section}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={slideFromLeft}>
        <PageHeader
          title="Fee Payments"
          subtitle="Track and manage student fee payments"
        />
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={slideFromLeft}>
        <AnimatedCard>
          <div
            className="
                    p-4
                    flex flex-col gap-4
                    sm:flex-row sm:items-end sm:justify-between
                  "
          >
            <SelectField
              label="Select Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              options={classes.map((c) => ({
                name: `${c.name} - ${c.section}`,
                id: c.id,
              }))}
            />

            <button
              style={{ backgroundColor: `${MAIN_COLOR}` }}
              onClick={handleDownloadPDF}
              className="
                  text-white
                  h-[44px]
                  px-6
                  rounded-lg
                  text-sm font-medium
                  whitespace-nowrap
                  hover:opacity-90
                  transition
                  w-full sm:w-auto"
            >
              Download PDF
            </button>
          </div>
        </AnimatedCard>
      </motion.div>

      {selectedClass && classStats && <FeeStats stats={classStats} />}

      {selectedClass ? (
        <motion.div initial="hidden" animate="visible" variants={slideFromLeft}>
          <AnimatedCard>
            <div className="p-4">
              <h3 className="font-semibold mb-3">
                Fee Details -{" "}
                {classes.find((c) => c.id === selectedClass)?.name} -{" "}
                {classes.find((c) => c.id === selectedClass)?.section}
              </h3>

              <FeeDetails fees={filteredFees} loading={false} />
            </div>
          </AnimatedCard>
        </motion.div>
      ) : (
        <EmptyFeeState />
      )}
    </div>
  );
}
