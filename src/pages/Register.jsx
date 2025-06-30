import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError("⚠️ Username sudah dipakai atau terjadi kesalahan.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9f3e9] to-[#f5e5d5] px-4">
      <div className="card w-full max-w-md bg-white shadow-xl border border-[#8b5e3c] rounded-lg">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#5e3a21]">Buat Akun Baru</h2>

          {error && (
            <div className="alert alert-error text-sm p-2 mb-2 rounded bg-red-100 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="input input-bordered w-full border-[#8b5e3c] focus:border-[#8b5e3c] focus:ring-[#8b5e3c]"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input input-bordered w-full border-[#8b5e3c] focus:border-[#8b5e3c] focus:ring-[#8b5e3c]"
              required
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="select select-bordered w-full border-[#8b5e3c] focus:border-[#8b5e3c] focus:ring-[#8b5e3c]"
            >
              <option value="user">User </option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary w-full bg-[#8b5e3c] hover:bg-[#5e3a21] text-white">
              Register
            </button>
          </form>

          <p className="text-sm mt-4 text-center text-[#5e3a21]">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#8b5e3c] font-medium hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
