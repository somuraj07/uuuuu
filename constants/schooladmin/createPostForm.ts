import { FormField } from "@/interfaces/dashboard";

export const addNewsfeedFields: FormField[] = [
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    options: [
      { label: "Announcement", value: "announcement" },
      { label: "Event", value: "event" },
      { label: "Achievement", value: "achievement" },
    ],
  },
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Enter title",
  },
  {
    name: "tagline",
    label: "Tagline",
    type: "text",
    required: false,
    placeholder: "Short highlight (optional)",
  },
  {
    name: "description",
    label: "Content",
    type: "textarea",
    required: true,
    placeholder: "Write your announcement here...",
  },
  {
    name: "media",
    label: "Upload Image",
    type: "file",
    required: false,
    accept: "image/*",
  },
];
