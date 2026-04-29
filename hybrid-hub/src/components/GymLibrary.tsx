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
    <div className="max-w-4xl mx-auto w-full space-y-6 mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-iron-100 flex items-center gap-3 uppercase tracking-tight">
          <Dumbbell className="text-iron-accent" size={28} /> 
          Biblioteca Gym
        </h2>

        <div className="flex flex-wrap items-center gap-2 bg-iron-800 p-1 rounded-xl">
          <Filter size={16} className="text-gray-500 ml-2" />
          {bodyParts.map(part => (
            <button
              key={part}
              onClick={() => setFilter(part)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase transition-all ${
                filter === part ? "bg-iron-accent text-iron-900" : "text-gray-400 hover:text-iron-100"
              }`}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map(ex => (
          <div key={ex._id} className="bg-iron-800 rounded-2xl p-5 border-l-4 border-iron-accent hover:bg-iron-700/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-iron-100">{ex.name}</h3>
                <span className="text-xs font-bold text-iron-accent uppercase tracking-wider">{ex.bodyPart}</span>
              </div>
              
              {editingId !== ex._id && (
                <div className="flex items-center gap-3">
                  <button onClick={() => { setEditingId(ex._id); setEditWeight(ex.weight || 0); }} className="text-gray-400 hover:text-iron-accent transition-colors" title="Editar">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(ex._id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Borrar">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-iron-900 p-3 rounded-xl">
              <div className="text-iron-100 font-bold">
                {ex.sets} <span className="text-gray-500 text-sm">x</span> {ex.reps} <span className="text-gray-500 text-sm">reps</span>
              </div>

              {editingId === ex._id ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={editWeight} 
                    onChange={(e) => setEditWeight(Number(e.target.value))}
                    className="w-16 bg-iron-800 text-iron-accent font-bold text-center rounded-lg py-1 outline-none border border-iron-700 focus:border-iron-accent"
                  />
                  <span className="text-gray-400 text-sm font-bold mr-2">kg</span>
                  <button onClick={() => handleSave(ex._id)} className="text-green-400 hover:text-green-300"><CheckCircle2 size={20}/></button>
                  <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300"><X size={20}/></button>
                </div>
              ) : (
                <div className="text-iron-accent font-black text-xl">
                  {ex.weight} <span className="text-sm text-gray-500">kg</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredExercises.length === 0 && (
        <p className="text-gray-500 text-center py-8">No hay ejercicios en esta categoría.</p>
      )}
    </div>
  );
};