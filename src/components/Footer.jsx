export default function Footer() {
  return (
    <footer className="bg-[#8b5e3c] text-[#f9f3e9] px-6 py-10 border-t border-[#8b5e3c]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
        
        {/* Brand Info */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-bold">
            <span className="text-[#f9f3e9]">🐾</span> PawPals
          </h2>
          <p className="mt-2 text-sm text-[#f9f3e9]/80">
            Temukan teman berbulu baru. Adopsi hewan lebih mudah dan menyenangkan bersama PawPals! 💖
          </p>
          <p className="text-xs text-[#f9f3e9]/60 mt-2">© 2025 Gen-Z Dev Team</p>
        </div>

      </div>
    </footer>
  );
}
