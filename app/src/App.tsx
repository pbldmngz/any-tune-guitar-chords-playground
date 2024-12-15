import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/main" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/main" />} />
    </Routes>
  );
}

export default App;
