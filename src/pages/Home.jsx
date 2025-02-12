import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
        Chào mừng bạn đến với công cụ chụp ảnh sản phẩm!
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center max-w-2xl opacity-90">
        Ứng dụng hỗ trợ chụp ảnh nhanh chóng và dễ dàng. Hãy chọn một tùy chọn
        bên dưới để bắt đầu.
      </p>

      <div className="flex space-x-6">
        <button
          onClick={() => navigate("/screen-all-product")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all hover:scale-105"
        >
          Chụp nhiều sản phẩm
        </button>
        <button
          onClick={() => navigate("/screen-single-product")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all hover:scale-105"
        >
          Chụp từng sản phẩm
        </button>
      </div>
    </div>
  );
};

export default Home;
