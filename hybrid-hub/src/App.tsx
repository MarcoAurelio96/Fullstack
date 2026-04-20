import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cuando la URL sea la principal (/), mostramos el Registro por ahora */}
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;