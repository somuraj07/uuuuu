"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle } from "lucide-react";
import { toast } from "@/services/toast/toast.service";
import { MAIN_COLOR, MAIN_COLOR_LIGHT, ACCENT_COLOR } from "@/constants/colors";
import { useSession } from "next-auth/react";

interface TeacherAttendance {
  id: string;
  date: string;
  status: string;
  selfie: string;
  latitude: number | null;
  longitude: number | null;
  locationAddress: string | null;
  createdAt: string;
}

export default function TeacherSelfAttendancePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<TeacherAttendance | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/teacher-attendance/list?date=${today}`);
      const data = await res.json();
      if (res.ok && data.attendances?.length > 0) {
        setAttendanceStatus(data.attendances[0]);
      }
    } catch (error) {
      console.error("Fetch attendance error:", error);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraOpen(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Unable to access camera. Please allow camera permissions.");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setSelfie(dataUrl);
      closeCamera();
    }
  };

  const markAttendance = async () => {
    if (!selfie) {
      toast.error("Please take a selfie first");
      return;
    }

    setMarking(true);
    try {
      const res = await fetch("/api/teacher-attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selfie,
          latitude: null,
          longitude: null,
          locationAddress: null,
          status: "PRESENT",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to mark attendance");
        return;
      }

      toast.success("Attendance marked successfully!");
      setSelfie(null);
      fetchTodayAttendance();
    } catch (error) {
      console.error("Mark attendance error:", error);
      toast.error("Something went wrong");
    } finally {
      setMarking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: MAIN_COLOR }}>
            Mark Your Attendance
          </h1>
          <p className="text-gray-600">
            Take a selfie to mark your attendance
          </p>
        </motion.div>

        {/* Today's Status */}
        {attendanceStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6"
            style={{ backgroundColor: ACCENT_COLOR + "40" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={24} style={{ color: MAIN_COLOR }} />
              <h2 className="text-xl font-semibold" style={{ color: MAIN_COLOR }}>
                Attendance Already Marked
              </h2>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Date:</span> {formatDate(attendanceStatus.date)}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="px-2 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: ACCENT_COLOR, color: MAIN_COLOR }}>
                  {attendanceStatus.status}
                </span>
              </p>
            </div>
            {attendanceStatus.selfie && (
              <div className="mt-4">
                <img
                  src={attendanceStatus.selfie}
                  alt="Attendance selfie"
                  className="w-32 h-32 object-cover rounded-lg border-2"
                  style={{ borderColor: MAIN_COLOR }}
                />
              </div>
            )}
          </motion.div>
        )}

        {!attendanceStatus && (
          <>
            {/* Selfie Capture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: MAIN_COLOR }}>
                Take Selfie
              </h2>
              
              {/* Camera View - Show directly in panel */}
              {cameraOpen && !selfie && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-2 bg-black" style={{ borderColor: MAIN_COLOR }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto max-h-96 object-cover"
                      style={{ transform: "scaleX(-1)" }}
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          videoRef.current.play().catch(console.error);
                        }
                      }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeCamera}
                      className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={captureSelfie}
                      className="flex-1 py-3 px-4 rounded-lg text-white font-medium transition"
                      style={{ backgroundColor: MAIN_COLOR }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Capture
                    </button>
                  </div>
                </div>
              )}

              {/* Preview and Submit - Show after capture */}
              {selfie && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="flex justify-center">
                      <img
                        src={selfie}
                        alt="Selfie Preview"
                        className="w-full max-w-md h-auto object-cover rounded-2xl border-4 shadow-lg"
                        style={{ borderColor: MAIN_COLOR }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelfie(null);
                        closeCamera();
                      }}
                      className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Retake
                    </button>
                    <button
                      onClick={markAttendance}
                      disabled={marking}
                      className="flex-1 py-3 px-4 rounded-lg text-white font-medium transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                      style={{ backgroundColor: MAIN_COLOR }}
                      onMouseEnter={(e) => !marking && (e.currentTarget.style.opacity = "0.9")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      {marking ? "Submitting..." : "Submit Attendance"}
                    </button>
                  </div>
                </div>
              )}

              {/* Open Camera Button - Show when no camera and no selfie */}
              {!cameraOpen && !selfie && (
                <div className="space-y-4">
                  <button
                    onClick={openCamera}
                    className="w-full py-12 rounded-2xl border-2 border-dashed border-gray-300 hover:border-purple-400 transition flex flex-col items-center justify-center gap-3 glass"
                    style={{ borderColor: cameraOpen ? MAIN_COLOR : undefined }}
                  >
                    <Camera size={48} style={{ color: MAIN_COLOR }} />
                    <span className="font-medium" style={{ color: MAIN_COLOR }}>
                      Open Camera
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
