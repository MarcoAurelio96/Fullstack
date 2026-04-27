import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Activity, Edit2, CheckCircle2, X, Filter, Trash2 } from "lucide-react";

interface CardioExercise {
  _id: string;
  name: string;
  cardioType: string;
  distance: number;
  duration?: number;
}

export const CardioLibrary = () => {
  const { currentUser } = useAuth();
  const [exercises, setExercises] = useState<CardioExercise[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState<string>("Todos");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDist, setEditDist] = useState<number>(0);
  const [editDur, setEditDur] = useState<number>(0);

  useEffect(() => {
    fetchExercises();
  }, [currentUser]);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/workouts?email=${currentUser?.email}`);
      if (response.ok) {
        const data = await response.json();
        setExercises(data.filter((ex: any) => ex.cardioType));
      }
    } catch (error) {
      console.error("Error al cargar la biblioteca de Cardio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distance: editDist, duration: editDur }),
      });

      if (response.ok) {
        setExercises(prev => prev.map(ex => ex._id === id ? { ...ex, distance: editDist, duration: editDur } : ex));
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
        const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
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

  const cardioTypes = ["Todos", "Correr", "Andar"];

  const filteredExercises = filter === "Todos" 
    ? exercises 
    : exercises.filter(ex => ex.cardioType?.toLowerCase() === filter.toLowerCase());

  if (loading) return <div className="text-center text-iron-accent py-12 font-medium animate-pulse">Cargando tus rutas... 🏃‍♂️</div>;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-iron-100 flex items-center gap-3 uppercase tracking-tight">
          <Activity className="text-iron-accent" size={28} /> 
          Biblioteca Cardio
        </h2>

        <div className="flex flex-wrap items-center gap-2 bg-iron-800 p-1 rounded-xl">
          <Filter size={16} className="text-gray-500 ml-2" />
          {cardioTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase transition-all ${
                filter === type ? "bg-iron-accent text-iron-900" : "text-gray-400 hover:text-iron-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredExercises.map(ex => (
          <div key={ex._id} className="bg-iron-800 rounded-2xl p-5 border-l-4 border-iron-accent hover:bg-iron-700/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div>
              <h3 className="text-xl font-bold text-iron-100">{ex.name}</h3>
              <span className="text-xs font-bold text-iron-accent uppercase tracking-wider">{ex.cardioType}</span>
            </div>

            {editingId === ex._id ? (
              <div className="flex flex-wrap items-center gap-3 bg-iron-900 p-3 rounded-xl">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Distancia</span>
                  <input type="number" step="0.1" value={editDist} onChange={(e) => setEditDist(Number(e.target.value))} className="w-16 bg-iron-800 text-iron-accent font-bold text-center rounded-lg py-1 outline-none border border-iron-700 focus:border-iron-accent" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Minutos</span>
                  <input type="number" value={editDur} onChange={(e) => setEditDur(Number(e.target.value))} className="w-16 bg-iron-800 text-iron-accent font-bold text-center rounded-lg py-1 outline-none border border-iron-700 focus:border-iron-accent" />
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={() => handleSave(ex._id)} className="text-green-400 hover:text-green-300"><CheckCircle2 size={24}/></button>
                  <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300"><X size={24}/></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6 bg-iron-900 p-3 rounded-xl min-w-[200px] justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-iron-accent font-black text-xl">{ex.distance}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase">Km</span>
                </div>
                <div className="h-8 w-px bg-iron-700"></div>
                <div className="flex flex-col items-center">
                  <span className="text-iron-100 font-bold text-xl">{ex.duration || 0}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase">Min</span>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <button onClick={() => { setEditingId(ex._id); setEditDist(ex.distance || 0); setEditDur(ex.duration || 0); }} className="text-gray-500 hover:text-iron-accent" title="Editar">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(ex._id)} className="text-gray-500 hover:text-red-400 transition-colors" title="Borrar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {filteredExercises.length === 0 && (
        <p className="text-gray-500 text-center py-8">No hay ejercicios en esta categoría.</p>
      )}
    </div>
  );
};