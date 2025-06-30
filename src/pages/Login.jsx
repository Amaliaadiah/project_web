import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // ← Tambahkan useNavigate

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); // ← Inisialisasi navigasi
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      login(token, role); // ← Simpan token & role

      // 🔁 Redirect berdasarkan role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("⚠️ Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9f3e9] to-[#f5e5d5] px-4">
      <div className="card w-full max-w-md bg-white shadow-xl border border-[#8b5e3c] rounded-lg">
        <div className="card-body">
          <h2 className="text-3xl font-bold mb-4 text-center text-[#5e3a21]">
            Masuk ke Akun Anda
          </h2>

          {error && (
            <div className="alert alert-error p-2 text-sm rounded mb-2 bg-red-100 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input input-bordered w-full border-[#8b5e3c] focus:border-[#8b5e3c] focus:ring-[#8b5e3c]"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full border-[#8b5e3c] focus:border-[#8b5e3c] focus:ring-[#8b5e3c]"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full bg-[#8b5e3c] hover:bg-[#5e3a21] text-white"
            >
              Login
            </button>
          </form>

          <p className="text-sm mt-4 text-center text-[#5e3a21]">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-[#8b5e3c] font-medium hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
