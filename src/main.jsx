import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "/src/style.css";
import App from "/src/elements/App";
import i18n from "./translation/i18n";
import { AuthProvider } from "./context/AuthProvider";
import HiddenSVGIcons from "./elements/shared/HiddenSVGIcons";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <HiddenSVGIcons />
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
