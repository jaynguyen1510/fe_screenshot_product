import { useMutation } from "@tanstack/react-query";
import { screenShotCellPhones } from "../Service/screenService"; // Import hàm API

// Tạo một function riêng biệt để gọi API
const screenCellPhones = async (url) => {
  try {
    const result = await screenShotCellPhones(url); // Gọi API từ Service
    return result; // Trả về dữ liệu sau khi API thành công
  } catch (error) {
    console.log("Failed to capture screenshot", error);
    throw new Error("Lỗi khi gọi API chụp ảnh màn hình");
  }
};

const useScreenCellPhoneS = () => {
  // Sử dụng useMutation để thực hiện yêu cầu POST
  const mutation = useMutation({
    mutationFn: screenCellPhones, // Dùng function screenCellPhones thay vì screenCellPhoneS trực tiếp
  });

  return {
    mutateCellPhoneS: mutation.mutate, // Trả về mutateCellPhoneS thay vì mutate
    isLoadingCellPhoneS: mutation.isLoading,
    isErrorCellPhoneS: mutation.isError,
    dataCellPhoneS: mutation.data,
    errorCellPhoneS: mutation.error,
  };
};

export default useScreenCellPhoneS;
