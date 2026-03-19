export interface Patient {
  name: string;
  age: number;
  condition: string;
}

export interface PatientWithId extends Patient {
  id: number;
}

export interface AuditLog {
  id: number;
  doctor_id: number;
  patient_id: number;
  field_name: string;
  old_value: string | null;
  new_value: string;
  edited_at: string;
}
