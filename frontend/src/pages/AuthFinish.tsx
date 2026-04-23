/**
 * AuthFinish — Redirect handler after Google OAuth callback
 * Sends user to the dashboard after successful authentication
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthFinish() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after OAuth
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
    }}>
      <p>Signing you in…</p>
    </div>
  );
}
