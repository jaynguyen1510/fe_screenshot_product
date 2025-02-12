import { HashRouter, Routes, Route } from "react-router-dom";

import HeaderComponents from "./Components/HeaderComponents/HeaderComponents";
import ScreenshotComponent from "./Components/ScreenshotComponent/ScreenshotComponent";
import ScreenshotSingleProduct from "./Components/ScreenshotComponent/ScreenshotSingleProduct";
import Home from "./pages/Home";

export default function App() {
  return (
    <HashRouter>
      <HeaderComponents /> {/* Component Header sẽ luôn xuất hiện */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screen-all-product" element={<ScreenshotComponent />} />
        <Route
          path="/screen-single-product"
          element={<ScreenshotSingleProduct />}
        />
      </Routes>
    </HashRouter>
  );
}
