import { useEffect, useState } from "react";
import { getPatient, updatePatient, getHistory } from "../api/patientApi";
import SignatureModal from "../components/SignatureModal";
import AuditHistory from "../components/AuditHistory";
import { type Patient } from "../types";

export default function PatientEdit() {
  const id = window.location.pathname.split("/").pop();
  const token = localStorage.getItem("token");

  const [patient, setPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState([]);
  const [showSignature, setShowSignature] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token && id) {
      setLoading(true);
      getPatient(token, id)
        .then((res) => setPatient(res.data))
        .catch(() => setError("Failed to load patient"))
        .finally(() => setLoading(false));

      getHistory(token, id)
  .then((res) => setHistory(res.data))
  .catch(() => setError("Failed to load audit history"));
    }
  }, []);

  const save = async (pwd: string) => {
    setSaving(true);
    setError("");
    try {
      await updatePatient(token!, id!, { ...patient, password: pwd });
      window.location.reload();
    } catch (err) {
      setError("Failed to update patient. Check your password.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading patient...</div>;
  if (error && !patient) return <div style={{ color: "red" }}>{error}</div>;
  if (!patient) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Patient</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 8, fontWeight: "bold" }}>
        <div style={{ flex: 1 }}>Name</div>
        <div style={{ flex: 1 }}>Age</div>
        <div style={{ flex: 2 }}>Condition</div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <input
          style={{ flex: 1 }}
          value={patient.name || ""}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
        />
        <input
          style={{ flex: 1 }}
          type="number"
          value={patient.age || ""}
          onChange={(e) => setPatient({ ...patient, age: Number(e.target.value) })}
        />
        <input
          style={{ flex: 2 }}
          value={patient.condition || ""}
          onChange={(e) => setPatient({ ...patient, condition: e.target.value })}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => setShowSignature(true)} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>

      <SignatureModal
        open={showSignature}
        onClose={() => setShowSignature(false)}
        onConfirm={(pwd: string) => {
          setShowSignature(false);
          save(pwd);
        }}
      />

      <h3>Audit History</h3>
      <AuditHistory history={history} />
    </div>
  );
}
