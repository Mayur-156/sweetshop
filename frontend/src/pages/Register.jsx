import { useState } from "react";
import { registerUser } from "../services/api";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await registerUser({ name, email, password });

    if (res.message) {
      alert(res.message);
    }

    if (res._id || res.user) {
      alert("Registration successful. Please login.");
      window.location.href = "/login"; // ✅ FIX
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
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <br /><br />

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
