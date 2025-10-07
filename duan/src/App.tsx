import Section1Journey from "./components/sections/Section1Journey";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <main className="relative">
        <Section1Journey />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                Tư Tưởng Hồ Chí Minh
              </h3>
              <p className="text-yellow-100/80 text-sm">
                Hành trình lịch sử - Giá trị bất diệt
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-yellow-200 mb-3">
                Nội Dung
              </h4>
              <ul className="space-y-2 text-sm text-yellow-100/70">
                <li>• Hành trình 30 năm tìm đường cứu nước</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-yellow-500/30 text-center">
            <p className="text-yellow-200/60 text-sm">
              © 2025 Dự án môn Tư tưởng Hồ Chí Minh | Được xây dựng với ❤️ và
              tôn kính
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
