import JSZip from "jszip";
import { optionsWeb } from "../../utils.js";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import { Button, Select } from "flowbite-react";
import useScreenCellPhoneS from "../../Hook/useScreenCellPhoneS.js";
import useScreenDidongviet from "../../Hook/useScreenDidongviet.js";
import useScreenHoangHa from "../../Hook/useScreenHoangHa.js";

const ScreenshotComponent = () => {
  const {
    mutateCellPhoneS,
    isLoadingCellPhoneS,
    isErrorCellPhoneS,
    dataCellPhoneS,
    errorCellPhoneS,
  } = useScreenCellPhoneS();
  const {
    mutateDiDongViet,
    isLoadingDiDongViet,
    isErrorDiDongViet,
    dataDiDongViet,
    errorDiDongViet,
  } = useScreenDidongviet();
  const {
    mutateHoangHa,
    isLoadingHoangHa,
    isErrorHoangHa,
    dataHoangHa,
    errorHoangHa,
  } = useScreenHoangHa();
  const [url, setUrl] = useState("");
  const [screenShots, setScreenShots] = useState([]);
  const [visibleScreenshots, setVisibleScreenshots] = useState(6);
  const [selectOption, setSelectOption] = useState("cellPhoneS");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectChange = (e) => {
    const selectOption = e.target.value;
    setUrl("");
    setSelectOption(selectOption);
  };
  useEffect(() => {
    setScreenShots([]); // Reset screenShots khi đổi lựa chọn
  }, [selectOption]);

  // Hàm xử lý sắp xếp chung
  const sortProducts = (data) => {
    if (!Array.isArray(data)) return []; // Tránh lỗi khi data không phải là mảng
    return [...data].sort((a, b) => {
      const parsePrice = (price) => {
        if (!price || typeof price !== "string") return NaN;
        return parseFloat(price.replace(/,/g, ""));
      };

      const priceA = parsePrice(a.productPrice);
      const priceB = parsePrice(b.productPrice);

      if (isNaN(priceA) && isNaN(priceB)) return 0;
      if (isNaN(priceA)) return 1;
      if (isNaN(priceB)) return -1;
      return priceB - priceA;
    });
  };

  // Hàm xử lý sắp xếp CellPhoneS
  const sortCellPhoneS = (data) => sortProducts(data);

  // Hàm xử lý sắp xếp DiDongViet
  const sortDiDongViet = (data) => sortProducts(data);

  // Hàm xử lý sắp xếp HoangHa
  const sortHoangHa = (data) => sortProducts(data);
  // Hàm xử lý sắp xếp tgdd

  // Hàm chính để call api

  // useEffect gọi các hàm sắp xếp
  useEffect(() => {
    if (
      selectOption === "cellPhoneS" &&
      Array.isArray(dataCellPhoneS) &&
      dataCellPhoneS.length > 0
    ) {
      setScreenShots(sortCellPhoneS(dataCellPhoneS));
    } else if (
      selectOption === "didongviet" &&
      Array.isArray(dataDiDongViet) &&
      dataDiDongViet.length > 0
    ) {
      setScreenShots(sortDiDongViet(dataDiDongViet));
    } else if (
      selectOption === "hoangha" &&
      Array.isArray(dataHoangHa) &&
      dataHoangHa.length > 0
    ) {
      setScreenShots(sortHoangHa(dataHoangHa));
    }
  }, [selectOption, dataCellPhoneS, dataDiDongViet, dataHoangHa]);

  // Hàm kiểm tra URL và xử lý lỗi
  const validateURL = (url) => {
    if (!url) {
      setErrorMessage("Vui lòng nhập URL.");
      return false;
    }
    return true;
  };
  // Hàm xử lý việc gọi mutation cho CellPhoneS
  const captureCellPhoneS = (url) => {
    try {
      mutateCellPhoneS(url);
    } catch (error) {
      setErrorMessage(
        "Bạn đã nhập sai đường link hoặc có lỗi xảy ra, vui lòng load lại trang."
      );
      console.error(error);
    }
  };

  const captureHoangHa = (url) => {
    try {
      mutateHoangHa(url);
    } catch (err) {
      setErrorMessage(
        "Bạn đã nhập sai đường link hoặc có lỗi xảy ra, vui lòng tải lại trang."
      );
      console.error(err);
    }
  };

  // Hàm xử lý việc gọi mutation cho DiDongViet
  const captureDiDongViet = (url) => {
    try {
      mutateDiDongViet(url);
    } catch (err) {
      setErrorMessage(
        "Bạn đã nhập sai đường link hoặc có lỗi xảy ra, vui lòng tải lại trang."
      );
      console.error(err);
    }
  };
  // hàm chính để call api
  const handleCaptureScreenshot = () => {
    if (!validateURL(url)) {
      return;
    }
    if (selectOption === "cellPhoneS") {
      captureCellPhoneS(url);
    } else if (selectOption === "didongviet") {
      captureDiDongViet(url);
    } else if (selectOption === "hoangha") {
      captureHoangHa(url);
    }
  };

  const handleCombineScreenshots = async (screenshotsData) => {
    const chunkSize = 6;
    const chunks = splitIntoChunks(screenshotsData, chunkSize);
    const zip = new JSZip();

    for (let i = 0; i < chunks.length; i++) {
      const group = chunks[i];
      const canvas = createCanvas(group.length);
      await drawImagesOnCanvas(canvas, group);
      const blob = await createBlobFromCanvas(canvas);
      zip.file(`combined_screenshot_group_${i + 1}.png`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "screenshots.zip");
  };

  const splitIntoChunks = (data, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const createCanvas = (numberOfImages) => {
    const canvas = document.createElement("canvas");
    canvas.width = 500 * numberOfImages;
    canvas.height = 1000;
    return canvas;
  };

  const drawImagesOnCanvas = async (canvas, group) => {
    const ctx = canvas.getContext("2d");
    const imgWidth = 500;
    const imgHeight = 1000;

    const loadImagePromises = group.map((screenshot, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, index * imgWidth, 0, imgWidth, imgHeight);
          resolve();
        };
        img.onerror = (err) => reject(err);
        img.src = screenshot.screenshot;
      });
    });

    await Promise.all(loadImagePromises);
  };

  const createBlobFromCanvas = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Không thể tạo blob từ canvas"));
        }
      });
    });
  };

  const handleDownloadAllImage = async () => {
    if (screenShots.length === 0) {
      alert("Chưa có ảnh nào để tải xuống");
      return;
    }
    await handleCombineScreenshots(screenShots);
  };

  const handleLoadMore = () => {
    setVisibleScreenshots((prev) => prev + 6);
  };

  const formatPrice = (price) => {
    if (isNaN(price)) {
      return price; // Keep the text if not a number
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-16">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Chụp Nhiều sản phẩm
        </h1>

        {/* Dropdown lựa chọn option */}
        <div>
          <Select
            value={selectOption}
            onChange={handleSelectChange}
            className="w-full md:w-1/3"
          >
            <option value="cellPhoneS">{optionsWeb.cellPhoneS.name}</option>
            <option value="didongviet">{optionsWeb.didongviet.name}</option>
            <option value="hoangha">{optionsWeb.hoangha.name}</option>
          </Select>
        </div>

        {/* Input URL và Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={optionsWeb[selectOption].placeholder} // Thay đổi placeholder dựa trên lựa chọn
            className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleCaptureScreenshot}
            className="w-full md:w-1/3 bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {isLoadingCellPhoneS || isLoadingDiDongViet || isLoadingHoangHa
              ? "Đang Chụp..."
              : "Chụp Màn Hình"}
          </Button>
        </div>

        <Button
          onClick={handleDownloadAllImage}
          className="w-full bg-gray-500 text-white py-3 rounded-lg shadow-md hover:bg-gray-600 transition mb-6"
        >
          Tải Tất Cả Ảnh
        </Button>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 text-red-500 font-semibold">{errorMessage}</div>
        )}

        <div className="overflow-x-auto mb-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  STT
                </th>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Ảnh Đã Chụp
                </th>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Tên Sản Phẩm
                </th>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Giá
                </th>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Đường Dẫn Web
                </th>
              </tr>
            </thead>
            <tbody>
              {screenShots.length > 0 &&
                screenShots
                  .slice(0, visibleScreenshots)
                  .map((screenshot, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <td className="border border-gray-300 px-6 py-4 text-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <img
                          src={screenshot.screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-40 mx-auto rounded-lg shadow-md hover:scale-105 transition-transform"
                        />
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center text-sm font-medium text-gray-600">
                        {screenshot.productName}
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center text-sm font-medium text-gray-600">
                        {screenshot.productPrice
                          ? formatPrice(screenshot.productPrice)
                          : "Chưa có giá"}
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-sm text-blue-500 underline">
                        {screenshot ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        ) : (
                          <span>Không có đường dẫn</span>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {(isErrorCellPhoneS || isErrorDiDongViet || isErrorHoangHa) && (
          <p className="mt-4 text-red-500 font-semibold">
            Có lỗi xảy ra:{" "}
            {(errorCellPhoneS || errorDiDongViet || errorHoangHa).message}
          </p>
        )}

        {screenShots.length > 6 && visibleScreenshots < screenShots.length && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleLoadMore}
              className="text-sm text-blue-500 font-semibold"
            >
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenshotComponent;
