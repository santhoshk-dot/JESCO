import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SearchProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </SearchProvider>
  </BrowserRouter>
);
