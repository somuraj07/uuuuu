import { FeeReceiptInput } from "@/interfaces/student";
import jsPDF from "jspdf";


export function generateFeeReceipt({
  payment,
  student,
  school,
}: FeeReceiptInput) {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(school.name, 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${school.address}, ${school.city ?? ""} ${school.pincode ?? ""}`,
    105,
    26,
    { align: "center" }
  );

  doc.text("FEE PAYMENT RECEIPT", 105, 36, { align: "center" });
  doc.line(15, 40, 195, 40);

  doc.text(`Student Name: ${student.name ?? "-"}`, 15, 50);
  doc.text(`Email: ${student.email ?? "-"}`, 15, 56);

  doc.text(`Receipt No: ${payment.razorpayPaymentId}`, 120, 50);
  doc.text(
    `Date: ${new Date(payment.createdAt).toLocaleDateString()}`,
    120,
    56
  );

  doc.line(15, 62, 195, 62);

  doc.text(`Amount Paid: ₹${payment.amount.toFixed(2)}`, 15, 72);
  doc.text(`Payment Status: ${payment.status}`, 15, 78);

  doc.text(`Order ID: ${payment.razorpayOrderId}`, 15, 84);
  doc.text(`Payment ID: ${payment.razorpayPaymentId}`, 15, 90);

  doc.setFontSize(9);
  doc.text(
    "This is a system generated receipt. No signature required.",
    105,
    110,
    { align: "center" }
  );

  doc.save(`Fee_Receipt_${payment.razorpayPaymentId}.pdf`);
}
