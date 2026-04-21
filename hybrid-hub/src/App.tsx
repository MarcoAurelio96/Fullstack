import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login"; // <-- AÑADIMOS ESTO
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  if (!currentUser) return <Navigate to="/login" />; // <-- AHORA MANDAMOS AL LOGIN SI NO ESTÁ AUTENTICADO
  
  return <>{children}</>;
};

function App() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Registro (Ruta raíz /) */}
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/dashboard" /> : <Register />} 
        />
        
        {/* Login */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        {/* Dashboard Privado */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;