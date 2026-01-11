"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import CommonModal from "@/components/ui/models/CommonModel";
import CommonButton from "@/components/ui/common/CommonButton";
import DynamicForm from "@/components/ui/models/DynamicForm";
import { FiPlus, FiCalendar, FiBookOpen } from "react-icons/fi";
import { addWorkshopFields } from "@/constants/schooladmin/addWorkshopForm";
import { MAIN_COLOR } from "@/constants/colors";
import { toast } from "@/services/toast/toast.service";

interface Workshop {
  id: string;
  title: string;
  description: string;
  eventDate: string | null;
  photo?: string;
  class?: {
    id: string;
    name: string;
    section?: string | null;
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export default function WorkshopsPage({
  workshops,
  loading,
  reload,
}: {
  workshops: Workshop[];
  loading: boolean;
  reload: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [classOptions, setClassOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const res = await fetch("/api/class/list");
        const data = await res.json();

        if (data.classes) {
          setClassOptions(
            data.classes.map((cls: any) => ({
              label: `Class ${cls.name}`,
              value: cls.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching class options:", error);
      }
    };

    fetchClassOptions();
  }, []);

  const workshopFields = addWorkshopFields.map((field) =>
    field.name === "classId"
      ? { ...field, options: classOptions }
      : field
  );


  const handleAddWorkshop = async (values: Record<string, any>) => {
    try {
      let imageBase64: string | null = null;

      if (values.photo) {
        if (values.photo.size > 500_000) {
          toast.error("Image must be less than 500KB");
          return;
        }
        imageBase64 = await fileToBase64(values.photo);
      }

      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description || "",
          eventDate: values.eventDate || "",
          classId: values.classId || "",
          photo: imageBase64,
        }),
      });

      if (!res.ok) throw new Error("Failed to add workshop");

      toast.success("Workshop created successfully");
      setOpen(false);
      reload();
    } catch (error) {
      console.error("Add workshop error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Workshops & Events
          </h1>
          <p className="text-sm text-gray-500">
            Manage school workshops and extracurricular activities
          </p>
        </div>

        <CommonButton
          label="Add Workshop"
          icon={<FiPlus />}
          onClick={() => setOpen(true)}
        />
      </div>

      <CommonModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Workshop"
        width="max-w-xl"
      >
        <DynamicForm
          fields={workshopFields}
          submitLabel="Add Workshop"
          onSubmit={handleAddWorkshop}
        />
      </CommonModal>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-gray-500">Loading workshops...</p>
        </div>
      ) : workshops.length === 0 ? (
        <p className="text-sm text-gray-500">No workshops found</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {workshops.map((workshop) => (
            <motion.div
              key={workshop.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.04,
                y: -8,
                boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col"
            >
              {workshop.photo ? (
                <img
                  src={workshop.photo}
                  alt={workshop.title}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    Workshop Image
                  </span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1 space-y-2">
                <h3 className="font-semibold text-gray-900">
                  {workshop.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {workshop.description || "No description available"}
                </p>

                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} style={{ color: MAIN_COLOR }} />
                    <span>
                      End Date:{" "}
                      {workshop.eventDate
                        ? new Date(workshop.eventDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FiBookOpen size={14} style={{ color: MAIN_COLOR }} />
                    <span>
                      Class:{" "}
                      {workshop.class
                        ? `Class ${workshop.class.name}${
                            workshop.class.section
                              ? ` - ${workshop.class.section}`
                              : ""
                          }`
                        : "-"}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-auto w-full border border-green-500 text-green-600 rounded-md py-1.5 text-sm hover:bg-green-50 transition"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
