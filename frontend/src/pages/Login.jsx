import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });

      console.log("LOGIN RESPONSE:", res); // 🔍 DEBUG

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role); // ✅ FIXED LINE
        alert("✅ Login successful");
        navigate("/home");
      } else {
        setError(res.message || "Login failed");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "320px",
        margin: "80px auto",
        padding: "20px",
        borderRadius: "10px",
        background: "#1e1e1e",
        color: "#fff",
        border: "1px solid #444",
      }}
    >
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
