// pages/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", age: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    if (!user?.token) return;

    if (user.role !== "admin") {
      navigate("/home");
      return;
    }

    getAllData();
  }, [user?.token]);

  const getAllData = async () => {
    try {
      setLoading(true);
      const [resPets, resAdoptions] = await Promise.all([
        api.get("/pets", { headers }),
        api.get("/adoptions", { headers }),
      ]);
      setPets(resPets.data);
      setAdoptions(resAdoptions.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", type: "", age: "", description: "" });
    setImageFile(null);
    setEditingPet(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingPet) {
        await api.put(`/pets/${editingPet.id}/`, formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/pets/", formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      getAllData();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setForm({
      name: pet.name,
      type: pet.type,
      age: pet.age,
      description: pet.description,
    });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pets/${id}`, { headers });
      getAllData();
    } catch (err) {
      console.error("Gagal menghapus hewan:", err);
    }
  };

  const updateAdoption = async (id, status) => {
    try {
      await api.put(`/adoptions/${id}`, { status }, { headers });
      getAllData();
    } catch (err) {
      console.error("Gagal mengubah status adopsi:", err);
    }
  };

  const handleDeleteAdoption = async (id) => {
    try {
      await api.delete(`/adoptions/${id}`, { headers });
      getAllData();
    } catch (err) {
      console.error("Gagal menghapus pengajuan adopsi:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#5e3a21] font-semibold">
        Memuat data...
      </div>
    );
  }

  if (!user?.token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Mohon login ulang... (token kosong)
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gradient-to-br from-[#f9f3e9] to-[#f5e5d5] min-h-screen space-y-12">
        {/* FORM */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#5e3a21]">
            {editingPet ? "Edit Hewan" : "Tambah Hewan Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input input-bordered"
              placeholder="Nama"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input input-bordered"
              placeholder="Jenis (kucing/anjing)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
            <input
              type="number"
              className="input input-bordered"
              placeholder="Umur"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              required
            />
            <input
              className="input input-bordered"
              placeholder="Deskripsi"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered col-span-1 md:col-span-2"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button
              type="submit"
              className="btn btn-primary col-span-1 md:col-span-2 bg-[#8b5e3c] hover:bg-[#5e3a21] text-white"
            >
              {editingPet ? "Update" : "Tambah"}
            </button>
          </form>
        </section>

        {/* DAFTAR HEWAN */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#5e3a21]">Daftar Hewan</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-[#5e3a21]">Foto</th>
                  <th className="text-[#5e3a21]">Nama</th>
                  <th className="text-[#5e3a21]">Jenis</th>
                  <th className="text-[#5e3a21]">Umur</th>
                  <th className="text-[#5e3a21]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id}>
                    <td>
                      {pet.image_url ? (
                        <img
                          src={pet.image_url}
                          alt={pet.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="text-[#5e3a21]">{pet.name}</td>
                    <td className="text-[#5e3a21]">{pet.type}</td>
                    <td className="text-[#5e3a21]">{pet.age}</td>
                    <td className="flex flex-wrap gap-2">
                      <button className="btn btn-sm btn-info" onClick={() => handleEdit(pet)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-error" onClick={() => handleDelete(pet.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PENGAJUAN ADOPSI */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#5e3a21]">Pengajuan Adopsi</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-[#5e3a21]">Hewan</th>
                  <th className="text-[#5e3a21]">Pengguna</th>
                  <th className="text-[#5e3a21]">Status</th>
                  <th className="text-[#5e3a21]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {adoptions.map((a) => (
                  <tr key={a.id} className="bg-[#f9f3e9]">
                    <td className="text-[#5e3a21]">{a.pet?.name || "-"}</td>
                    <td className="text-[#5e3a21]">{a.user?.username || "-"}</td>
                    <td>
                      <span
                        className={`badge px-3 py-1 text-sm capitalize ${
                          a.status === "approved"
                            ? "bg-green-600"
                            : a.status === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        } text-white`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => updateAdoption(a.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => updateAdoption(a.id, "rejected")}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDeleteAdoption(a.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
