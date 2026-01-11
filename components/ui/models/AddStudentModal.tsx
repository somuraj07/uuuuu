"use client";

import { useState } from "react";
import { toast } from "@/services/toast/toast.service";
import { MAIN_COLOR } from "@/constants/colors";
import InputField from "../common/InputField";
import {
  addStudent,
  assignStudentsToClass,
} from "@/services/schooladmin/students.service";

interface Props {
  classId: string;
  onClose: () => void;
  onSuccess: () => void;
}

type FormState = {
  name: string;
  AdmissionNo: string;
  fatherName: string;
  aadhaarNo: string;
  phoneNo: string;
  dob: string;
  address: string;
  totalFee: string;
  discountPercent: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function AddStudentModal({
  classId,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    AdmissionNo: "",
    fatherName: "",
    aadhaarNo: "",
    phoneNo: "",
    dob: "",
    address: "",
    totalFee: "",
    discountPercent: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  /* ---------------- Change Handler ---------------- */

  const handleChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [key]: e.target.value });
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  /* ---------------- Validation ---------------- */

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!form.name.trim() || form.name.length < 2)
      newErrors.name = "Student name must be at least 2 characters";

    if (!form.AdmissionNo.trim())
      newErrors.AdmissionNo = "Admission number is required";

    if (!form.fatherName.trim() || form.fatherName.length < 2)
      newErrors.fatherName = "Father name must be at least 2 characters";

    if (!/^\d{12}$/.test(form.aadhaarNo))
      newErrors.aadhaarNo = "Aadhaar number must be exactly 12 digits";

    if (!/^\d{10}$/.test(form.phoneNo))
      newErrors.phoneNo = "Phone number must be exactly 10 digits";

    if (!form.dob || new Date(form.dob) >= new Date())
      newErrors.dob = "Please enter a valid date of birth";

    if (!form.totalFee || Number(form.totalFee) <= 0)
      newErrors.totalFee = "Total fee must be a positive number";

    if (
      form.discountPercent &&
      (Number(form.discountPercent) < 0 || Number(form.discountPercent) > 100)
    )
      newErrors.discountPercent = "Discount must be between 0 and 100";

    if (form.address && form.address.length < 5)
      newErrors.address = "Address must be at least 5 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const addStudentResponse: Response = await addStudent({
        name: form.name,
        AdmissionNo: form.AdmissionNo,
        fatherName: form.fatherName,
        aadhaarNo: form.aadhaarNo,
        phoneNo: form.phoneNo,
        dob: form.dob,
        classId,
        address: form.address || undefined,
        totalFee: Number(form.totalFee),
        discountPercent: form.discountPercent
          ? Number(form.discountPercent)
          : 0,
      });
      const addStudentData = await addStudentResponse.json();

      if (addStudentResponse.status === 409) {
        toast.error(addStudentData.message || "Conflict error");
        return;
      }
      if (!addStudentResponse.ok) {
        toast.error(addStudentData.message || "Failed to add student");
        return;
      }
      const assignStudentsToClassResponse: Response = await assignStudentsToClass(
        addStudentData.student.id,
        classId
      );
      const assignStudentsToClassData =
        await assignStudentsToClassResponse.json(); 
      if (!assignStudentsToClassResponse.ok) {
        toast.error(
          assignStudentsToClassData.message ||
            "Failed to assign student to class"
        );
        return;
      }
      toast.success("Student added and assigned to class successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding student", error);
    } finally {
      setLoading(false);
    }
  };

  const renderError = (key: keyof Errors) =>
    errors[key] && <p className="text-sm text-red-600">{errors[key]}</p>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-6">Add New Student</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["name", "Student Name*"],
            ["AdmissionNo", "Admission Number*"],
            ["fatherName", "Father Name*"],
            ["aadhaarNo", "Aadhaar Number*"],
            ["phoneNo", "Phone Number*"],
            ["dob", "Date of Birth*"],
            ["totalFee", "Total Fee*"],
            ["discountPercent", "Discount (%)"],
          ].map(([key, label]) => (
            <div key={key}>
              <InputField
                label={label}
                value={(form as any)[key]}
                onChange={handleChange(key as keyof FormState)}
                placeholder={key === "dob" ? "YYYY-MM-DD" : key === "AdmissionNo" ? "e.g. 2024001" : ""}
                type={key === "dob" ? "date" : "text"}
              />
              {key === "AdmissionNo" && (
                <p className="text-xs text-gray-500 mt-1">
                  Email will be auto-generated as: {form.AdmissionNo ? `${form.AdmissionNo}@u7.com` : 'admission_number@u7.com'}
                </p>
              )}
              {renderError(key as keyof Errors)}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <InputField
            label="Address"
            placeholder=""
            value={form.address}
            onChange={handleChange("address")}
          />
          {renderError("address")}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: MAIN_COLOR }}
          className="mt-6 w-full text-white py-3 rounded-xl font-medium disabled:opacity-60"
        >
          {loading ? "Adding Student..." : "Add Student"}
        </button>
      </div>
    </div>
  );
}
