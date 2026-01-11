import { FormField } from "@/interfaces/dashboard";

export const addWorkshopFields: FormField[] = [
  {
    name: "title",
    label: "Workshop Title",
    type: "text",
    placeholder: "Enter workshop title",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe the workshop",
  },
  {
    name: "eventDate", 
    label: "End Date",
    type: "date",
    placeholder: "Select end date",
  },
  {
    name: "classId", 
    label: "Target Class",
    type: "select",
    placeholder: "Select class",
    options: [],
  },
  {
    name: "photo", 
    label: "Workshop Image",
    type: "file",
    placeholder: "Upload workshop image",
  },
];
