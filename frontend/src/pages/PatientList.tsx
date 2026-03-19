import { useEffect, useState } from "react";
import { getPatients } from "../api/patientApi";
import { type PatientWithId } from "../types";

export default function PatientList() {
  const [patients, setPatients] = useState<PatientWithId[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token")!;
    getPatients(token)
      .then((res) => setPatients(res.data))
      .catch(() => setError("Failed to load patients. Please refresh."));
  }, []);

  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Patients</h2>
      <a href="/patients/new">Add New Patient</a>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name} - {p.condition}
            <span style={{ marginLeft: "8px" }}><a href={`/patients/${p.id}`}>Edit</a></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
