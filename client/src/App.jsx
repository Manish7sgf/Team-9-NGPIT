import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import "../src/styles/globals.css";

/**
 * App root.
 * For the Portfolio Generator standalone build, the only active route is /portfolio.
 * Extend with other pages (Dashboard, TimeMachine, etc.) as you build them.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/portfolio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
