import axios from "axios";

// Lấy URL API từ biến môi trường
const apiUrl = import.meta.env.VITE_API_URL;

// Hàm gọi API để chụp ảnh màn hình
export const screenShotCellPhones = async (url) => {
  try {
    const response = await axios.post(
      `${apiUrl}/screenshot/screen-cellphones`,
      {
        url,
      }
    );
    return response.data.screenshots; // Trả về dữ liệu ảnh chụp màn hình
  } catch (error) {
    console.error("Lỗi khi chụp ảnh màn hình:", error);
    throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi hàm
  }
};

export const screenShotDiDongViet = async (url) => {
  try {
    const response = await axios.post(
      `${apiUrl}/screenshot/screen-di-dong-viet`,
      {
        url,
      }
    );
    return response.data.screenshots; // Trả về dữ liệu ảnh chụp màn hình
  } catch (error) {
    console.error("Lỗi khi chụp ảnh màn hình:", error);
    throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi hàm
  }
};
