import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function SignatureModal({ open, onClose, onConfirm }: Props) {
  const [pwd, setPwd] = useState("");
  if (!open) return null;

  return (
    <div className="modal">
      <h3>Sign Changes</h3>
      <input
        type="password"
        placeholder="Enter your password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <button onClick={() => { onConfirm(pwd); setPwd(""); }}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
