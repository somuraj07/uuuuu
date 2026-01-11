"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function SchoolPage() {
  const { data: session, status } = useSession();

  const [showForm, setShowForm] = useState(false);
  const [school, setSchool] = useState<any>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [icon, setIcon] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [msg, setMsg] = useState("");

  /* ---------------- Fetch School ---------------- */
  useEffect(() => {
    if (!session) return;

    async function fetchSchool() {
      const res = await fetch("/api/school/mine");
      const data = await res.json();

      if (data.school) {
        setSchool(data.school);
        setName(data.school.name || "");
        setAddress(data.school.address || "");
        setLocation(data.school.location || "");
        setPincode(data.school.pincode || "");
        setDistrict(data.school.district || "");
        setState(data.school.state || "");
        setCity(data.school.city || "");
        setIcon(data.school.icon || null);
        setPreview(data.school.icon || null);
      }
    }

    fetchSchool();
  }, [session]);

  if (status === "loading") return <p className="p-6">Loading...</p>;
  if (!session) return <p className="p-6 text-red-600">Unauthorized</p>;

  /* ---------------- Icon Upload ---------------- */
  const handleIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setIcon(reader.result as string);
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- Create ---------------- */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/school/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address,
        location,
        icon,
        pincode,
        district,
        state,
        city,
      }),
    });

    const data = await res.json();
    setMsg(data.message);
    if (data.school) setSchool(data.school);
  }

  /* ---------------- Update ---------------- */
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/school/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address,
        location,
        icon,
        pincode,
        district,
        state,
        city,
      }),
    });

    const data = await res.json();
    setMsg(data.message);
    if (data.updated) setSchool(data.updated);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">School Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-100"
        >
          {session.user?.email}
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        {msg && <p className="mb-4 text-green-700 font-semibold">{msg}</p>}

        {/* Existing School */}
        {school && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 border p-4 rounded mb-6"
          >
            <h3 className="font-bold text-green-700 mb-2">Your School</h3>

            {school.icon && (
              <img
                src={school.icon}
                alt="School Icon"
                className="w-20 h-20 rounded object-cover mb-3"
              />
            )}

            <p><b>Name:</b> {school.name}</p>
            <p><b>Address:</b> {school.address}</p>
            <p><b>Location:</b> {school.location}</p>
            <p><b>City:</b> {school.city}</p>
            <p><b>District:</b> {school.district}</p>
            <p><b>State:</b> {school.state}</p>
            <p><b>Pincode:</b> {school.pincode}</p>
          </motion.div>
        )}

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border rounded p-6 shadow"
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                {school ? "Update School" : "Create School"}
              </h2>

              <form
                onSubmit={school ? handleUpdate : handleCreate}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input className="border p-2 rounded" placeholder="School Name" value={name} onChange={e => setName(e.target.value)} required />
                <input className="border p-2 rounded" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
                <input className="border p-2 rounded md:col-span-2" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />

                <input className="border p-2 rounded" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
                <input className="border p-2 rounded" placeholder="District" value={district} onChange={e => setDistrict(e.target.value)} />
                <input className="border p-2 rounded" placeholder="State" value={state} onChange={e => setState(e.target.value)} />
                <input className="border p-2 rounded" placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} />

                {/* Icon Upload */}
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">School Icon</label>
                  <input type="file" accept="image/*" onChange={handleIconUpload} />
                  {preview && (
                    <img src={preview} className="mt-2 w-24 h-24 rounded border object-cover" />
                  )}
                </div>

                <button
                  type="submit"
                  className={`md:col-span-2 py-2 text-white rounded ${
                    school ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {school ? "Update School" : "Create School"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
