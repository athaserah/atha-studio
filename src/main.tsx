import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize keepalive
import '@/utils/keepalive';

createRoot(document.getElementById("root")!).render(<App />);
