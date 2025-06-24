export default function SuccessPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/cust2.jpg?height=1080&width=1920')",
        }}
      > 
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        {/* Header */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2">
            <img
            src="/travelkif.png"
            alt="TravelKIF Logo"
            className="h-10 w-auto"
          />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-8 border border-white/20">
            <h1 className="text-6xl font-bold text-amber-400 mb-6">BONJOUR!</h1>

            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              SELAMAT KODE ANDA TELAH
              <br />
              BERHASIL DIREDEEM
            </h2>

            <p className="text-xl text-amber-400 font-medium">ANDA AKAN SEGERA DIHUBUNGI OLEH TRAVELKIF</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-white/80 font-medium">© Travelkif 2025</div>
      </div>
    </div>
  )
}
