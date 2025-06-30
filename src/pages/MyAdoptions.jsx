import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

export default function MyAdoptions() {
  const { user } = useAuth();
  const location = useLocation();
  const initialAdoptions = location.state?.adoptions || [];

  const [adoptions, setAdoptions] = useState(initialAdoptions);
  const [loading, setLoading] = useState(initialAdoptions.length === 0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || initialAdoptions.length > 0) return;

      try {
        const res = await api.get("/adoptions/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAdoptions(res.data);
      } catch (err) {
        console.error("Gagal ambil data adopsi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9f3e9] to-[#f5e5d5]">
          <p className="text-xl font-semibold text-[#5e3a21]">Silakan login dulu 🐾</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-200 p-4 bg-gradient-to-br from-[#f9f3e9] to-[#f5e5d5]">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#5e3a21]">Pengajuan Adopsi Saya</h1>

        {loading ? (
          <p className="text-[#5e3a21]">Loading...</p>
        ) : adoptions.length === 0 ? (
          <p className="text-[#5e3a21]">Belum ada pengajuan adopsi.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adoptions.map((item) => (
              <div key={item.id} className="card bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <figure>
                  <img
                    src={
                      item.pet?.image_url
                        ? `http://127.0.0.1:8000${item.pet.image_url}`
                        : "/no-image.png"
                    }
                    alt={item.pet?.name || "Hewan"}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-[#5e3a21]">{item.pet?.name || "-"}</h2>
                  <p className="text-[#5e3a21]">Jenis: {item.pet?.type || "-"}</p>
                  <p className="text-[#5e3a21]">Umur: {item.pet?.age || "-"} tahun</p>
                  <p className="text-[#5e3a21]">{item.pet?.description || "-"}</p>
                  {item.created_at && (
                    <p className="text-sm text-gray-500 mt-1">
                      Diajukan:{" "}
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <div
                    className={`badge mt-2 ${
                      item.status === "diterima"
                        ? "badge-success"
                        : item.status === "ditolak"
                        ? "badge-error"
                        : "badge-info"
                    }`}
                  >
                    Status: {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
