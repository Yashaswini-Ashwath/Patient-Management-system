import { pool } from "../db/pool";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// GET /patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM patients");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /patients/:id
export const getPatient = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM patients WHERE id=$1", [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Patient not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /patients/:id/history
export const getHistory = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM audit_logs WHERE patient_id=$1 ORDER BY edited_at DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /patients
export const createPatient = async (req: Request, res: Response) => {
  const doctorId = (req as any).doctorId;
  const { name, age, condition } = req.body;

  if (!name || !age || !condition)
    return res.status(400).json({ message: "Name, age and condition are required" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO patients (name, age, condition) VALUES ($1, $2, $3) RETURNING *`,
      [name, age, condition]
    );
    const patient = result.rows[0];

    await client.query(
      `INSERT INTO audit_logs (doctor_id, patient_id, field_name, old_value, new_value)
       VALUES ($1, $2, $3, $4, $5)`,
      [doctorId, patient.id, "CREATE", null, JSON.stringify({ name, age, condition })]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Patient record created successfully", patient });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

// PUT /patients/:id
export const updatePatient = async (req: Request, res: Response) => {
  const doctorId = (req as any).doctorId;
  const { password, ...updates } = req.body;

  const doctor = await pool.query("SELECT password_hash FROM doctors WHERE id=$1", [doctorId]);
  if (doctor.rows.length === 0)
    return res.status(404).json({ message: "Doctor not found" });

  const valid = await bcrypt.compare(password, doctor.rows[0].password_hash);
  if (!valid)
    return res.status(400).json({ message: "Invalid signature" });

  const oldData = await pool.query("SELECT * FROM patients WHERE id=$1", [req.params.id]);
  if (oldData.rowCount === 0)
    return res.status(404).json({ message: "Patient not found" });
  const old = oldData.rows[0];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE patients SET name=$1, age=$2, condition=$3 WHERE id=$4",
      [updates.name, updates.age, updates.condition, req.params.id]
    );

    const fields = ["name", "age", "condition"];
    for (const field of fields) {
      if (String(old[field]) !== String(updates[field])) {
        await client.query(
          `INSERT INTO audit_logs (doctor_id, patient_id, field_name, old_value, new_value)
           VALUES ($1, $2, $3, $4, $5)`,
          [doctorId, req.params.id, field, old[field], updates[field]]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ message: "Patient updated successfully" });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};
