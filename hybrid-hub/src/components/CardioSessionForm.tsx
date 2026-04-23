import { useState } from "react";
// 1. Importamos el contexto
import { useAuth } from "../context/AuthContext";

export const CardioSessionForm = () => {
  const { currentUser } = useAuth(); // Necesitamos saber quién es

  // Estados para el formulario
  const [type, setType] = useState<"Andar" | "Correr">("Andar");
  const [name, setName] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState(""); // Opcional
  const [pace, setPace] = useState(""); // Opcional

  // Estados para feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 2. Hacemos el POST al Backend
      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: currentUser?.email,
          category: "Cardio", // Le decimos a MongoDB que esto es Cardio
          name: name,
          cardioType: type, // "Andar" o "Correr"
          distance: Number(distance),
          // Si el usuario no puso nada, enviamos 'undefined' para que MongoDB no se queje
          duration: duration ? Number(duration) : undefined,
          pace: pace ? Number(pace) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar en el servidor");
      }

      setSuccess("¡Sesión de cardio guardada a tope! 🏃‍♂️💨");
      
      // Limpiamos los campos para dejarlo bonito
      setName("");
      setDistance("");
      setDuration("");
      setPace("");
      
    } catch (err) {
      setError("Hubo un problema al conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Crear nueva sesión</h3>

        {/* Mensajes de feedback */}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setType("Andar")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                type === "Andar" 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-200 hover:border-blue-200 bg-white"
              }`}
            >
              <span className="text-3xl mb-2">🚶</span>
              <span className="font-semibold text-sm">Andar</span>
            </button>

            <button
              type="button"
              onClick={() => setType("Correr")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                type === "Correr" 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-200 hover:border-blue-200 bg-white"
              }`}
            >
              <span className="text-3xl mb-2">🏃</span>
              <span className="font-semibold text-sm">Correr</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre de la sesión</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Correr post entreno"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Distancia (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="5.0"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              min="0.1"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duración (minutos)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ritmo (min/km)</label>
            <input
              type="number"
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              placeholder="6.0"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              min="1"
              step="0.1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2 flex justify-center items-center gap-2 disabled:bg-blue-400"
          >
            {loading ? (
              "Guardando..."
            ) : (
              <><span className="text-xl leading-none">+</span> Guardar sesión</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};