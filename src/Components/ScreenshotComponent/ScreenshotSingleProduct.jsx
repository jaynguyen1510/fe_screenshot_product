import JSZip from "jszip";
import { saveAs } from "file-saver";

import { useState, useEffect } from "react";
import useScreenThegioididong from "../../Hook/useScreenThegioididong";
import { Select, Button } from "flowbite-react";
import { optionsWeb } from "../../utils";

const ScreenshotSingleProduct = () => {
  const { mutateTgdd, isErrorTgdd, isLoadingTgdd, dataTgdd, errorTgdd } =
    useScreenThegioididong();
  const [url, setUrl] = useState("");
  const [screenShots, setScreenShots] = useState([]);
  const [visibleScreenshots, setVisibleScreenshots] = useState(6);
  const [selectOption, setSelectOption] = useState("cellPhoneS");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (dataTgdd) {
      const { productName, screenshots, productPrice } = dataTgdd;

      if (screenshots && screenshots.length > 0) {
        const formattedScreenshots = screenshots.map((screenshot) => ({
          screenshot,
          productName,
          productPrice,
        }));

        setScreenShots(formattedScreenshots);
      }
    }
  }, [dataTgdd]);

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
  // Hàm xử lý sắp xếp tgdd
  const sortThegioididong = (data) => sortProducts(data);
  // useEffect gọi các hàm sắp xếp
  useEffect(() => {
    if (
      selectOption === "thegioididong" &&
      Array.isArray(dataTgdd) &&
      dataTgdd.length > 0
    ) {
      setScreenShots(sortThegioididong(dataTgdd));
    }
  }, [selectOption, dataTgdd]);

  const handleSelectChange = (e) => {
    const selectOption = e.target.value;
    setUrl("");
    setSelectOption(selectOption);
  };
  useEffect(() => {
    setScreenShots([]); // Reset screenShots khi đổi lựa chọn
  }, [selectOption]);

  // Hàm kiểm tra URL và xử lý lỗi
  const validateURL = (url) => {
    if (!url) {
      setErrorMessage("Vui lòng nhập URL.");
      return false;
    }
    return true;
  };

  const captureThegioididong = (url) => {
    try {
      mutateTgdd(url);
    } catch (err) {
      setErrorMessage(
        "Bạn đã nhập sai đường link hoặc có lỗi xảy ra, vui lòng load lại trang."
      );
      console.error(err);
    }
  };
  // hàm chính để call api
  const handleCaptureScreenshot = () => {
    if (!validateURL(url)) {
      return;
    }
    if (selectOption === "thegioididong") {
      captureThegioididong(url);
    }
  };

  // const handleCombineScreenshots = async (screenshotsData) => {
  //   if (screenshotsData.length === 0) return;

  //   const canvas = createCanvas(screenshotsData.length);
  //   await drawImagesOnCanvas(canvas, screenshotsData);

  //   const blob = await createBlobFromCanvas(canvas);
  //   saveAs(blob, "combined_screenshot.png");
  // };
  const handleCombineScreenshots = async (screenshotsData) => {
    if (!screenshotsData || screenshotsData.length === 0) return;

    const chunks = splitIntoChunks(screenshotsData, 10); // Nhóm tối đa 10 ảnh
    const zip = new JSZip();

    for (let i = 0; i < chunks.length; i++) {
      const group = chunks[i];

      // Load hình ảnh để lấy kích thước thực tế
      const images = await loadImages(group);
      const canvas = createCanvas(images);
      await drawImagesOnCanvas(canvas, images);

      const blob = await createBlobFromCanvas(canvas);

      // Lưu file ZIP với tên sản phẩm
      group.forEach((item) => {
        const safeFileName = item.productName.replace(/[<>:"/\\|?*]+/g, ""); // Xóa ký tự đặc biệt
        zip.file(`${safeFileName}.png`, blob);
      });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "screenshots.zip");
  };

  // Chia ảnh thành từng nhóm nhỏ
  const splitIntoChunks = (data, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Load hình ảnh để lấy kích thước thực tế
  const loadImages = async (screenshots) => {
    return Promise.all(
      screenshots.map(({ screenshot }) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () =>
            resolve({ img, width: img.width, height: img.height });
          img.onerror = reject;
          img.src = screenshot;
        });
      })
    );
  };

  // Tạo canvas với tất cả ảnh trên 1 hàng ngang
  const createCanvas = (images) => {
    const totalWidth = images.reduce((sum, img) => sum + img.width, 0);
    const maxHeight = Math.max(...images.map((img) => img.height));

    const canvas = document.createElement("canvas");
    canvas.width = totalWidth;
    canvas.height = maxHeight;

    return canvas;
  };

  // Vẽ hình ảnh lên canvas theo hàng ngang
  const drawImagesOnCanvas = async (canvas, images) => {
    const ctx = canvas.getContext("2d");

    let xOffset = 0;
    images.forEach(({ img, width, height }) => {
      ctx.drawImage(img, xOffset, 0, width, height);
      xOffset += width;
    });
  };

  // Chuyển canvas thành Blob để tải về
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

  // Hàm tải xuống toàn bộ ảnh đã ghép
  const handleDownloadAllImage = async () => {
    if (screenShots.length === 0) {
      alert("Chưa có ảnh nào để tải xuống");
      return;
    }
    await handleCombineScreenshots(screenShots);
  };

  // const handleDownloadAllImage = async () => {
  //   const images = document.querySelectorAll("img"); // Lấy tất cả ảnh đang hiển thị
  //   if (images.length === 0) {
  //     alert("Chưa có ảnh nào để tải xuống");
  //     return;
  //   }

  //   const zip = new JSZip();

  //   for (let i = 0; i < images.length; i++) {
  //     const imgSrc = images[i].src;

  //     let imgBlob;
  //     if (imgSrc.startsWith("data:image")) {
  //       // Xử lý ảnh base64
  //       const base64Data = imgSrc.split(",")[1];
  //       const byteCharacters = atob(base64Data);
  //       const byteNumbers = new Uint8Array(byteCharacters.length);

  //       for (let j = 0; j < byteCharacters.length; j++) {
  //         byteNumbers[j] = byteCharacters.charCodeAt(j);
  //       }

  //       imgBlob = new Blob([byteNumbers], { type: "image/png" });
  //     } else {
  //       // Xử lý ảnh có URL
  //       imgBlob = await fetch(imgSrc).then((res) => res.blob());
  //     }

  //     zip.file(`screenshot_${i + 1}.png`, imgBlob);
  //   }

  //   const zipBlob = await zip.generateAsync({ type: "blob" });
  //   saveAs(zipBlob, "screenshots.zip");
  // };

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

  // Lấy productName từ phần tử đầu tiên trong nhóm
  // let fileName = group[0]?.productName
  //   ? `${group[0].productName
  //       .replace(/[^a-zA-Z0-9\s]/g, "")
  //       .replace(/\s+/g, "_")}.png`
  //   : `group_${i + 1}.png`;
  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-16">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Chụp Từng sản phẩm
        </h1>

        {/* Dropdown lựa chọn option */}
        <div className="mb-4">
          <Select
            value={selectOption}
            onChange={handleSelectChange}
            className="w-full md:w-1/3"
          >
            <option value="cellPhoneS">{optionsWeb.cellPhoneS.name}</option>
            <option value="didongviet">{optionsWeb.didongviet.name}</option>
            <option value="hoangha">{optionsWeb.hoangha.name}</option>
            <option value="thegioididong">
              {optionsWeb.thegioididong.name}
            </option>
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
            {isLoadingTgdd ? "Đang Chụp..." : "Chụp Màn Hình"}
          </Button>
        </div>

        <Button
          onClick={handleDownloadAllImage}
          className="w-full bg-gray-500 text-white py-3 rounded-lg shadow-md hover:bg-gray-600 transition mb-6"
        >
          Tải Tất Cả Ảnh
        </Button>

        {/* Bảng hiển thị ảnh đã chụp */}
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
                      <td className="border border-gray-300 px-6 py-4">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-6 py-4">
                        <img
                          src={screenshot.screenshot || ""}
                          alt="Screenshot"
                          className="w-20 h-20 object-cover"
                        />
                      </td>
                      <td className="border border-gray-300 px-6 py-4">
                        {screenshot.productName || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-6 py-4">
                        {formatPrice(screenshot.productPrice)}
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
        {isErrorTgdd && (
          <p className="mt-4 text-red-500 font-semibold">
            Có lỗi xảy ra: {errorMessage || errorTgdd.message}
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

export default ScreenshotSingleProduct;
