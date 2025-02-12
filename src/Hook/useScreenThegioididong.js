import { useMutation } from "@tanstack/react-query";
import { screenshotTgdd } from "../Service/screenService";
const useScreenThegioididong = () => {
  const screenTgdd = async (url) => {
    try {
      const response = await screenshotTgdd(url);
      return response;
    } catch (error) {
      console.log("Failed to capture screenshot", error);
      throw new Error("Lỗi khi gọi API chụp ảnh màn hình");
    }
  };
  const mutation = useMutation({
    mutationFn: screenTgdd,
  });
  return {
    mutateTgdd: mutation.mutate,
    isLoadingTgdd: mutation.isLoading,
    isErrorTgdd: mutation.isError,
    dataTgdd: mutation.data,
    errorTgdd: mutation.error,
  };
};

export default useScreenThegioididong;
