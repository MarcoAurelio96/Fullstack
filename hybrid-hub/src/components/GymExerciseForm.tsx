import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const GymExerciseForm = () => {
  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState("Pecho");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: currentUser?.email,
          category: "Gym",
          name: name,
          bodyPart: bodyPart,
          sets: Number(sets),
          reps: Number(reps),
          weight: Number(weight),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar en el servidor");
      }

      setSuccess("¡Ejercicio guardado con éxito! 💪");
      
      setName("");
      setSets("");
      setReps("");
      setWeight("");
      
    } catch (err) {
      setError("Hubo un problema al conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Ejercicios de Gimnasio</h2>
        <p className="text-gray-500 mt-1">Crea y gestiona tus ejercicios</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Crear nuevo ejercicio</h3>

        {/* Mensajes de feedback visuales */}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del ejercicio</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Press de banca"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parte del cuerpo</label>
            <div className="relative">
              <select
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="Pecho">Pecho</option>
                <option value="Biceps">Bíceps</option>
                <option value="Triceps">Tríceps</option>
                <option value="Espalda">Espalda</option>
                <option value="Hombro">Hombro</option>
                <option value="Pierna">Pierna</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Series</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="4"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Repeticiones</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="12"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="60"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              min="0"
              step="0.5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2 flex justify-center items-center gap-2 disabled:bg-blue-400"
          >
            {/* Si está cargando, cambiamos el texto */}
            {loading ? (
              "Guardando..."
            ) : (
              <><span className="text-xl leading-none">+</span> Guardar ejercicio</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};