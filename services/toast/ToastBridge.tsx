// src/services/toast/ToastBridge.tsx
"use client";

import { useEffect } from "react";
import { useToastContext } from "./ToastContext";
import { registerToast } from "./toast.service";

export default function ToastBridge() {
  const { show } = useToastContext();

  useEffect(() => {
    registerToast(show);
  }, [show]);

  return null;
}
