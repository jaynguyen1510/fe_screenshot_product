import { HashRouter, Routes, Route } from "react-router-dom";

import HeaderComponents from "./Components/HeaderComponents/HeaderComponents";
import ScreenshotComponent from "./Components/ScreenshotComponent/ScreenshotComponent";

export default function App() {
  return (
    <HashRouter>
      <HeaderComponents /> {/* Component Header sẽ luôn xuất hiện */}
      <Routes>
        <Route path="/" element={<ScreenshotComponent />} />
        {/* Route chính */}
      </Routes>
    </HashRouter>
  );
}
