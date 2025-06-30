import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";  
import Footer from "../components/Footer";  

export default function DashboardUser () {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [myAdoptions, setMyAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPets = await api.get("/pets/", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPets(resPets.data);

        const resAdoptions = await api.get("/adoptions/me", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMyAdoptions(resAdoptions.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  const handleAdopt = async (pet_id) => {
    try {
      await api.post("/adoptions/", { pet_id }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const updated = await api.get("/adoptions/me", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      navigate("/myadoptions", { state: { adoptions: updated.data } });
    } catch (err) {
      setMessage("⚠️ Kamu sudah mengajukan adopsi atau terjadi error.");
    }
  };

  const handleCancelAdoption = async (adoptionId) => {
    try {
      await api.delete(`/adoptions/me/${adoptionId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSelectedPet(null);

      const res = await api.get("/adoptions/me", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMyAdoptions(res.data);
    } catch (err) {
      setMessage("⚠️ Gagal membatalkan adopsi.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#f9f3e9] to-[#f5e5d5] p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#5e3a21]">Daftar Hewan</h1>
        </div>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {loading ? (
          <p className="text-[#5e3a21]">Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg overflow-hidden"
                onClick={() => setSelectedPet(pet)}
              >
                {pet.image_url && (
                  <img
                    src={`http://127.0.0.1:8000${pet.image_url}`}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="card-body p-4">
                  <h2 className="card-title text-[#4a3c2a] text-lg font-semibold">{pet.name}</h2>
                  <p className="text-[#4a3c2a] text-sm">Jenis: {pet.type}</p>
                  <p className="text-[#4a3c2a] text-sm">Umur: {pet.age} tahun</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
              {selectedPet.image_url && (
                <img
                  src={`http://127.0.0.1:8000${selectedPet.image_url}`}
                  alt={selectedPet.name}
                  className="w-full h-60 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-2 text-[#4a3c2a]">{selectedPet.name}</h2>
              <p className="mb-1 text-[#4a3c2a]">Jenis: {selectedPet.type}</p>
              <p className="mb-1 text-[#4a3c2a]">Umur: {selectedPet.age} tahun</p>
              <p className="mb-3 text-[#4a3c2a]">{selectedPet.description}</p>

              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedPet(null)}
                >
                  Batal
                </button>

                {(() => {
                  const adoption = myAdoptions.find(a => a.pet.id === selectedPet.id);
                  if (adoption) {
                    return (
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleCancelAdoption(adoption.id)}
                      >
                        Batalkan Adopsi
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAdopt(selectedPet.id)}
                      >
                        Ajukan Adopsi
                      </button>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
