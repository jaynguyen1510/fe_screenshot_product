import { useMutation } from "@tanstack/react-query";
import { screenShotHoangHa } from "../Service/screenService";

const useScreenHoangHa = () => {
  const screenHoangHa = async (url) => {
    try {
      const result = await screenShotHoangHa(url);
      return result;
    } catch (error) {
      console.log("Failed to capture screenshot", error);
      throw new Error("Lỗi khi gọi API chụp ảnh màn hình");
    }
  };
  const mutation = useMutation({
    mutationFn: screenHoangHa,
  });
  return {
    mutateHoangHa: mutation.mutate, // Trả về mutateHoangHa thay vì mutate
    isLoadingHoangHa: mutation.isLoading,
    isErrorHoangHa: mutation.isError,
    dataHoangHa: mutation.data,
    errorHoangHa: mutation.error,
  };
};

export default useScreenHoangHa;
