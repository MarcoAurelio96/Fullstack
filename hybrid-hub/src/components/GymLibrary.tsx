import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Dumbbell, Edit2, CheckCircle2, X, Filter, Trash2 } from "lucide-react";

interface GymExercise {
  _id: string;
  name: string;
  bodyPart: string;
  sets: number;
  reps: number;
  weight: number;
}

export const GymLibrary = () => {
  const { currentUser } = useAuth();
  const [exercises, setExercises] = useState<GymExercise[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState<string>("Todos");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState<number>(0);

  useEffect(() => {
    fetchExercises();
  }, [currentUser]);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`/api/workouts?email=${currentUser?.email}`);
      if (response.ok) {
        const data = await response.json();
        setExercises(data.filter((ex: any) => ex.bodyPart));
      }
    } catch (error) {
      console.error("Error al cargar la biblioteca de Gym:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: editWeight }),
      });

      if (response.ok) {
        setExercises(prev => prev.map(ex => ex._id === id ? { ...ex, weight: editWeight } : ex));
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("¿Seguro que quieres borrar este ejercicio de tu biblioteca? (Esto no afectará a tu historial pasado)");
    
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/workouts/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setExercises(prev => prev.filter(ex => ex._id !== id));
        } else {
          console.error("Error al borrar del servidor");
        }
      } catch (error) {
        console.error("Error de red al intentar borrar:", error);
      }
    }
  };

  const bodyParts = ["Todos", "Pecho", "Biceps", "Triceps", "Espalda", "Hombro", "Pierna"];

  const filteredExercises = filter === "Todos" 
    ? exercises 
    : exercises.filter(ex => ex.bodyPart?.toLowerCase() === filter.toLowerCase());

  if (loading) return <div className="text-center text-iron-accent py-12 font-medium animate-pulse">Cargando tu biblioteca Gym... 🏋️‍♂️</div>;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-iron-100 flex items-center gap-2 sm:gap-3 uppercase tracking-tight">
          <Dumbbell className="text-iron-accent w-6 h-6 sm:w-7 sm:h-7" /> 
          Biblioteca Gym
        </h2>

        <div className="flex items-center gap-2 bg-iron-800 p-1 sm:p-1.5 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar w-full md:w-auto">
          <Filter size={16} className="text-gray-500 ml-2 shrink-0 hidden sm:block" />
          {bodyParts.map(part => (
            <button
              key={part}
              onClick={() => setFilter(part)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs uppercase transition-all shrink-0 ${
                filter === part ? "bg-iron-accent text-iron-900 shadow-sm" : "text-gray-400 hover:text-iron-100"
              }`}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map(ex => (
          <div key={ex._id} className="bg-iron-800 rounded-2xl p-4 sm:p-5 border-l-4 border-iron-accent hover:bg-iron-700/50 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-iron-100 leading-tight">{ex.name}</h3>
                <span className="text-[10px] sm:text-xs font-bold text-iron-accent uppercase tracking-wider">{ex.bodyPart}</span>
              </div>
              
              {editingId !== ex._id && (
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                  <button onClick={() => { setEditingId(ex._id); setEditWeight(ex.weight || 0); }} className="p-1.5 sm:p-2 bg-iron-900 rounded-lg text-gray-400 hover:text-iron-accent transition-colors" title="Editar">
                    <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button onClick={() => handleDelete(ex._id)} className="p-1.5 sm:p-2 bg-iron-900 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Borrar">
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-iron-900 p-3 sm:p-4 rounded-xl">
              <div className="text-iron-100 font-bold text-sm sm:text-base">
                {ex.sets} <span className="text-gray-500 text-xs sm:text-sm">x</span> {ex.reps} <span className="text-gray-500 text-xs sm:text-sm">reps</span>
              </div>

              {editingId === ex._id ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={editWeight} 
                    onChange={(e) => setEditWeight(Number(e.target.value))}
                    className="w-14 sm:w-16 bg-iron-800 text-iron-accent font-bold text-center rounded-lg py-1 outline-none border border-iron-700 focus:border-iron-accent text-sm sm:text-base"
                  />
                  <span className="text-gray-400 text-xs sm:text-sm font-bold mr-1 sm:mr-2">kg</span>
                  <button onClick={() => handleSave(ex._id)} className="text-green-400 hover:text-green-300 p-1"><CheckCircle2 size={18} className="sm:w-5 sm:h-5"/></button>
                  <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300 p-1"><X size={18} className="sm:w-5 sm:h-5"/></button>
                </div>
              ) : (
                <div className="text-iron-accent font-black text-lg sm:text-xl">
                  {ex.weight} <span className="text-xs sm:text-sm text-gray-500 font-bold">kg</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredExercises.length === 0 && (
        <div className="bg-iron-800 rounded-2xl p-8 text-center border-2 border-dashed border-iron-700">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs sm:text-sm">No hay ejercicios en esta categoría.</p>
        </div>
      )}
    </div>
  );
};