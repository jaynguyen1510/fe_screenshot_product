import { useMutation } from "@tanstack/react-query";
import { screenShotDiDongViet } from "../Service/screenService";
const useScreenDidongviet = () => {
  const screenDiDongViet = async (url) => {
    try {
      const result = await screenShotDiDongViet(url); // Gọi API từ Service
      return result; // Trả về dữ liệu sau khi API thành công
    } catch (error) {
      console.log("Failed to capture screenshot", error);
      throw new Error("Lỗi khi gọi API chụp ảnh màn hình");
    }
  };
  const mutation = useMutation({
    mutationFn: screenDiDongViet,
  });
  return {
    mutateDiDongViet: mutation.mutate, // Trả về mutateDiDongViet thay vì mutate
    isLoadingDiDongViet: mutation.isLoading,
    isErrorDiDongViet: mutation.isError,
    dataDiDongViet: mutation.data,
    errorDiDongViet: mutation.error,
  };
};

export default useScreenDidongviet;
