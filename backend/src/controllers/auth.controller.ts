import {pool} from "../db/pool";
import {comparePassword} from "../utils/hash";
import { signToken } from "../utils/jwt";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const doctor = await pool.query("SELECT * FROM doctors WHERE email=$1", [email]);
    if (doctor.rowCount === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await comparePassword(password, doctor.rows[0].password_hash);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(doctor.rows[0].id);
    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};





