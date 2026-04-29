import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Dumbbell, PlusCircle } from "lucide-react";

export const GymExerciseForm = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState("Pecho");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const bodyParts = ["Pecho", "Biceps", "Triceps", "Espalda", "Hombro", "Pierna"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.email) {
      alert("Error: No se detecta el usuario. Por favor, inicia sesión de nuevo.");
      return;
    }

 const newWorkout = {
      userEmail: currentUser.email,
      type: "Gym",
      category: "Gym",
      name: name,
      bodyPart: bodyPart,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight)
    };

    console.log("📤 Enviando ejercicio:", newWorkout);

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        console.log("✅ Guardado con éxito");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("❌ Error del servidor:", errorData);
        alert("El servidor rechazó el ejercicio. Revisa los datos.");
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-xl bg-iron-900 text-iron-accent mb-3">
          <Dumbbell size={32} />
        </div>
        <h3 className="text-2xl font-black text-iron-100 uppercase tracking-tight">Nuevo Ejercicio</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black text-iron-accent uppercase mb-2 ml-1">Nombre del Ejercicio</label>
          <input 
            type="text" 
            required
            placeholder="Ej: Press de Banca"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-iron-accent uppercase mb-2 ml-1">Parte del Cuerpo</label>
            <select 
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors appearance-none"
            >
              {bodyParts.map(part => <option key={part} value={part}>{part}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-iron-accent uppercase mb-2 ml-1">Peso Inicial (kg)</label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-iron-accent uppercase mb-2 ml-1">Series</label>
            <input 
              type="number" 
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-iron-accent uppercase mb-2 ml-1">Reps</label>
            <input 
              type="number" 
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-colors"
            />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={!currentUser?.email}
        className="w-full bg-iron-accent text-iron-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
      >
        <PlusCircle size={20} />
        Añadir a mi Biblioteca
      </button>
    </form>
  );
};