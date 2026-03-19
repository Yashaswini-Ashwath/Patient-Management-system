import { useState } from "react";
import { createPatient } from "../api/patientApi";
import { type Patient } from "../types";

export default function PatientCreate() {
  const token = localStorage.getItem("token");
  const [patient, setPatient] = useState<Patient>({ name: "", age: 0, condition: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await createPatient(token!, patient);
      window.location.href = "/patients";
    } catch {
      setError("Failed to create patient. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Patient</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>Name</div>
        <div style={{ flex: 1 }}>Age</div>
        <div style={{ flex: 1 }}>Condition</div>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <input style={{ flex: 1 }} value={patient.name}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
        <input style={{ flex: 1 }} type="number" value={patient.age}
          onChange={(e) => setPatient({ ...patient, age: Number(e.target.value) })} />
        <input style={{ flex: 1 }} value={patient.condition}
          onChange={(e) => setPatient({ ...patient, condition: e.target.value })} />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={save} disabled={saving}>{saving ? "Saving..." : "Create"}</button>
    </div>
  );
}
