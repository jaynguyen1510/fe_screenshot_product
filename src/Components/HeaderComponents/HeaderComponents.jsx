import { useNavigate, useLocation } from "react-router-dom";

const HeaderComponents = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-opacity-100 font-bold scale-105 shadow-lg"
      : "bg-opacity-80";

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white py-2 z-50">
      <div className="flex justify-between items-center px-4">
        {/* Nút điều hướng */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/")}
            className={`bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 transform ${isActive(
              "/"
            )}`}
          >
            Trang chủ
          </button>
          {location.pathname !== "/" && (
            <>
              <button
                onClick={() => navigate("/screen-all-product")}
                className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 transform ${isActive(
                  "/screen-all-product"
                )}`}
              >
                Chụp nhiều sản phẩm
              </button>

              <button
                onClick={() => navigate("/screen-single-product")}
                className={`bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 transform ${isActive(
                  "/screen-single-product"
                )}`}
              >
                Chụp từng sản phẩm
              </button>
            </>
          )}
        </div>

        {/* Tiêu đề và nút tải file */}
        <div className="flex items-center space-x-4">
          <h1 className="bg-clip-padding p-4 text-center text-white rounded-md">
            Tải file về và chạy .exe
          </h1>

          <a
            href="https://drive.google.com/file/d/1xOo_W_YiXuIK0OYf8hKusg7trMgAIYnj/view?usp=drive_link"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
            download
          >
            Tải về File ZIP
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponents;
