import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./modules/auth/login";
import Panel from "./modules/panel/panel";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Panel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}