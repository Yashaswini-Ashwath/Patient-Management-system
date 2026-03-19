import { type AuditLog } from "../types";

export default function AuditHistory({ history }: { history: AuditLog[] }) {
  return (
    <ul>
      {history.map((h) => (
        <li key={h.id}>
          Update - {h.field_name}: {h.old_value} → {h.new_value} (at {h.edited_at})
        </li>
      ))}
    </ul>
  );
}
