import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Activity, PlusCircle } from "lucide-react";

export const CardioSessionForm = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [cardioType, setCardioType] = useState("Correr");
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.email) {
      alert("Error: No se detecta el usuario activo.");
      return;
    }

    const newWorkout = {
      userEmail: currentUser.email,
      type: "Cardio",
      category: "Cardio",
      name,
      cardioType,
      distance: Number(distance),
      duration: Number(duration)
    };

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        alert(`Error al guardar: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-5 sm:space-y-6">
      
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex p-3 rounded-xl bg-iron-900 text-iron-accent mb-2 sm:mb-3 shadow-inner">
          <Activity className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-iron-100 uppercase tracking-tight">Nueva Ruta</h3>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-[10px] sm:text-xs font-black text-iron-accent uppercase mb-1 sm:mb-2 ml-1">Nombre de la Ruta</label>
          <input 
            type="text" 
            required
            placeholder="Ej: Paseo por el parque"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] sm:text-xs font-black text-iron-accent uppercase mb-1 sm:mb-2 ml-1">Tipo de Actividad</label>
          <div className="flex gap-3 sm:gap-4">
            {["Correr", "Andar"].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setCardioType(type)}
                className={`flex-1 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold border-2 transition-all ${
                  cardioType === type 
                    ? 'bg-iron-accent border-iron-accent text-iron-900 shadow-md shadow-iron-accent/20' 
                    : 'bg-iron-900 border-iron-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-black text-iron-accent uppercase mb-1 sm:mb-2 ml-1">Distancia (km)</label>
            <input 
              type="number" 
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors text-center"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-black text-iron-accent uppercase mb-1 sm:mb-2 ml-1">Duración (min)</label>
            <input 
              type="number" 
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors text-center"
            />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={!currentUser?.email}
        className="w-full bg-iron-accent text-iron-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform uppercase tracking-widest disabled:opacity-50 mt-2 sm:mt-6 text-sm sm:text-base"
      >
        <PlusCircle size={20} />
        Guardar en Biblioteca
      </button>
    </form>
  );
};