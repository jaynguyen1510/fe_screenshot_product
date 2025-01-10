const HeaderComponents = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white py-2">
      <div className="flex justify-end items-center pr-4">
        <h1 className="bg-clip-padding p-4 text-center text-white rounded-md">
          Tải file về và chạy .exe
        </h1>

        <a
          href="https://drive.google.com/uc?export=download&id=1mNMTszLOxZKOTVL_MEhEGlu7trIXZeGI"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          download
        >
          Tải về File ZIP
        </a>
      </div>
    </div>
  );
};

export default HeaderComponents;
