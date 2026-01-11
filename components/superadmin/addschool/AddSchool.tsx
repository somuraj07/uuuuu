"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/common/InputField";
import SelectField from "@/components/ui/common/SelectField";
import FormSection from "@/components/ui/common/FormSection";
import SuccessPopup from "@/components/ui/common/SuccessPopup";
import { EDUCATION_BOARDS } from "@/constants/boards";
import { MAIN_COLOR } from "@/constants/colors";
import { SchoolFormState } from "@/interfaces/dashboard";


/* ---------------- Types ---------------- */

type FormErrors = {
  schoolName?: string;
  password?: string;
  email?: string;
};

/* ---------------- Helper ---------------- */

// 🔹 Convert image file → Base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/* ---------------- Component ---------------- */

export default function AddSchoolPage() {
  const router = useRouter();

  /* ---------------- Form State ---------------- */

  const [form, setForm] = useState<SchoolFormState>({
    schoolName: "",
    password: "",
    phone: "",
    email: "",
    classRange: "",
    board: "",
    addressLine: "",
    pincode: "",
    area: "",
    city: "",
    district: "",
    state: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  /* ---------------- Logo Upload ---------------- */

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      const base64 = await fileToBase64(file);
      setLogoBase64(base64);
    }
  };

  /* ---------------- Input Handler ---------------- */

  const handleChange =
    (field: keyof SchoolFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  /* ---------------- Validation ---------------- */

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Submit Handler ---------------- */

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!validateForm()) return;
  setLoading(true);

  try {
    /* ---------------- 1. Create School Admin ---------------- */
    const userRes = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.schoolName,
        email: form.email,
        password: form.password,
        role: "SCHOOLADMIN",
      }),
    });

    const userData = await userRes.json();
    if (!userRes.ok) {
      setError(userData.message || "Failed to create school admin");
      return;
    }

    const schoolAdminId = userData.user.id;

    /* ---------------- 2. Create School (POST) ---------------- */
    const schoolRes = await fetch("/api/school/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.schoolName,
        address: form.addressLine,
        location: form.area,
        icon: logoBase64,
        pincode: form.pincode,
        district: form.district,
        state: form.state,
        city: form.city,

        schoolAdminId,
      }),
    });

    const schoolData = await schoolRes.json();
    if (!schoolRes.ok) {
      setError(schoolData.message || "Failed to create school");
      return;
    }

    setShowSuccess(true);
  } catch (err) {
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- Reset ---------------- */

  const handleReset = () => {
    setForm({
      schoolName: "",
      password: "",
      phone: "",
      email: "",
      classRange: "",
      board: "",
      addressLine: "",
      pincode: "",
      area: "",
      city: "",
      district: "",
      state: "",
    });

    setErrors({});
    setLogoFile(null);
    setLogoBase64(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <form
        onSubmit={handleSignup}
        className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-sm"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Add New School</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-gray-500"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: MAIN_COLOR }}
              className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Basic Information */}
        <FormSection title="Basic Information">
          <div>
            <InputField
              label="School Name *"
              placeholder="School Name"
              value={form.schoolName}
              onChange={handleChange("schoolName")}
            />
            {errors.schoolName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolName}
              </p>
            )}
          </div>

          <div>
            <InputField
              label="Password *"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection title="Contact Information">
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Phone"
              placeholder="Contact number"
              value={form.phone}
              onChange={handleChange("phone")}
            />

            <div>
              <InputField
                label="Email *"
                type="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        </FormSection>

        {/* Class Information */}
        <FormSection title="Class Information">
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Class Range"
              placeholder="Class Range"
              value={form.classRange}
              onChange={handleChange("classRange")}
            />
            <SelectField
              label="Board of Education"
              value={form.board}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  board: e.target.value,
                }))
              }
              options={EDUCATION_BOARDS}
              placeholder="Select Board"
            />
          </div>
        </FormSection>

        {/* Address Details */}
        <FormSection title="Address Details">
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Address Line"
              value={form.addressLine}
              onChange={handleChange("addressLine")}
              placeholder=""
            />
            <InputField
              label="Pincode"
              value={form.pincode}
              onChange={handleChange("pincode")}
              placeholder=""
            />
            <InputField
              label="Area / Locality"
              value={form.area}
              onChange={handleChange("area")}
              placeholder=""
            />
            <InputField
              label="City"
              value={form.city}
              onChange={handleChange("city")}
              placeholder=""
            />
            <InputField
              label="District"
              value={form.district}
              onChange={handleChange("district")}
              placeholder=""
            />
            <InputField
              label="State"
              value={form.state}
              onChange={handleChange("state")}
              placeholder=""
            />
          </div>
        </FormSection>

        {/* Upload Logo */}
        <div className="mt-10 border-2 border-dashed rounded-xl p-10 flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="w-14 h-14 border rounded-lg flex items-center justify-center mb-3">
            <span className="text-xl">+</span>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {logoFile
              ? `Selected file: ${logoFile.name}`
              : "Drop your Logo to upload"}
          </p>

          <button
            type="button"
            onClick={handleFileSelect}
            className="border px-4 py-1 rounded-md text-sm hover:bg-gray-100"
          >
            Select files
          </button>
        </div>
      </form>

      <SuccessPopup
        open={showSuccess}
        title="School Created and Onboarded Successfully!"
        onClose={() => {
          setShowSuccess(false);
          handleReset();
        }}
      />
    </>
  );
}
