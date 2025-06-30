import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import HeroImg from "../assets/hero-img.png";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <section className="hero min-h-screen bg-gradient-to-br from-[#f9f3e9] to-[#f5e5d5]">
        <div className="hero-content flex-col-reverse lg:flex-row items-center justify-between gap-10 max-w-6xl mx-auto px-6">
          {/* Left Text Section */}
          <div className="text-center lg:text-left max-w-xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#5e3a21]">
              Adopsi Hewan Jadi <span className="text-[#8b5e3c]">Lebih Mudah ❤️</span>
            </h1>
            <p className="py-6 text-[#5e3a21] text-lg">
              Temukan teman berbulu yang menunggu untuk kamu beri rumah penuh cinta.
              Yuk, adopsi sekarang dan buat perbedaan!
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-4 justify-center lg:justify-start">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary hover:bg-[#8b5e3c] transition duration-300">
                    Lihat Daftar Hewan
                  </Link>
                  <Link to="/myadoptions" className="btn btn-outline btn-secondary hover:bg-gray-200 transition duration-300">
                    Status Adopsi Saya
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary hover:bg-[#8b5e3c] transition duration-300">
                    Masuk
                  </Link>
                  <Link to="/register" className="btn btn-outline btn-secondary hover:bg-gray-200 transition duration-300">
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
            <img src={HeroImg} alt="Adopsi Hewan" className="rounded-2xl shadow-lg object-cover" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
