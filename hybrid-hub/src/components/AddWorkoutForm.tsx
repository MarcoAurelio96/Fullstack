import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const AddWorkoutForm = () => {
  const { currentUser } = useAuth();

  const [type, setType] = useState("Correr");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!duration || Number(duration) <= 0) {
      setError("La duración debe ser mayor a 0 minutos.");
      return;
    }
    if ((type === "Correr" || type === "Andar") && (!distance || Number(distance) <= 0)) {
      setError("Por favor, introduce una distancia válida.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: currentUser?.email,
          type: type,
          duration: Number(duration),
          distance: type === "Fuerza" ? undefined : Number(distance) 
        }),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      setSuccess("¡Entrenamiento guardado en MongoDB con éxito! 🚀");
      setDuration("");
      setDistance("");
    } catch (err) {
      setError("Hubo un problema al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Registrar Actividad</h3>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Ejercicio</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Correr">🏃‍♂️ Correr</option>
            <option value="Andar">🚶‍♂️ Andar</option>
            <option value="Fuerza">🏋️‍♂️ Fuerza</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Duración (min)</label>
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ej: 45"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Distancia (km)</label>
            <input 
              type="number" 
              value={distance} 
              onChange={(e) => setDistance(e.target.value)}
              disabled={type === "Fuerza"}
              placeholder={type === "Fuerza" ? "N/A" : "Ej: 5.2"}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl disabled:opacity-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-blue-300 mt-2"
        >
          {loading ? "Guardando..." : "Guardar Entrenamiento"}
        </button>
      </form>
    </div>
  );
};