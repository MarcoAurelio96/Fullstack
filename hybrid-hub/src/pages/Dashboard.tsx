import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { AddWorkoutForm } from "../components/AddWorkoutForm";
import { WorkoutList } from "../components/WorkoutList";

export const Dashboard = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Mi Panel</h1>
            <p className="text-gray-500 mt-1">Bienvenido a tu espacio de entrenamiento</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
          <p className="text-blue-900 text-lg">
            ¡Hola, <span className="font-bold">{currentUser?.displayName || "Atleta"}</span>! 👋
          </p>
        </div>

        {/* --- AQUÍ PONEMOS EL FORMULARIO Y LA LISTA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda: Formulario */}
          <div>
            <AddWorkoutForm />
          </div>
          
          {/* Columna Derecha: Lista */}
          <div>
            <WorkoutList />
          </div>
        </div>

      </div>
    </div>
  );
};