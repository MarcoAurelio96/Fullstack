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
      const response = await fetch(`/api/workouts?email=${currentUser?.email}`);
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
      const response = await fetch(`/api/workouts/${id}`, {
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

  const cardioTypes = ["Todos", "Correr", "Andar"];

  const filteredExercises = filter === "Todos" 
    ? exercises 
    : exercises.filter(ex => ex.cardioType?.toLowerCase() === filter.toLowerCase());

  if (loading) return <div className="text-center text-iron-accent py-12 font-medium animate-pulse">Cargando tus rutas... 🏃‍♂️</div>;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-iron-100 flex items-center gap-2 sm:gap-3 uppercase tracking-tight">
          <Activity className="text-iron-accent w-6 h-6 sm:w-7 sm:h-7" /> 
          Biblioteca Cardio
        </h2>

        <div className="flex items-center gap-2 bg-iron-800 p-1 sm:p-1.5 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar w-full md:w-auto">
          <Filter size={16} className="text-gray-500 ml-2 shrink-0 hidden sm:block" />
          {cardioTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs uppercase transition-all shrink-0 ${
                filter === type ? "bg-iron-accent text-iron-900 shadow-sm" : "text-gray-400 hover:text-iron-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredExercises.map(ex => (
          <div key={ex._id} className="bg-iron-800 rounded-2xl p-4 sm:p-5 border-l-4 border-iron-accent hover:bg-iron-700/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            
            <div className="flex justify-between items-start md:items-center w-full md:w-auto">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-iron-100 leading-tight">{ex.name}</h3>
                <span className="text-[10px] sm:text-xs font-bold text-iron-accent uppercase tracking-wider">{ex.cardioType}</span>
              </div>
            
              {editingId !== ex._id && (
                <div className="flex md:hidden items-center gap-2 shrink-0">
                  <button onClick={() => { setEditingId(ex._id); setEditDist(ex.distance || 0); setEditDur(ex.duration || 0); }} className="p-1.5 bg-iron-900 rounded-lg text-gray-400 hover:text-iron-accent transition-colors" title="Editar">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(ex._id)} className="p-1.5 bg-iron-900 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Borrar">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {editingId === ex._id ? (
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-3 bg-iron-900 p-3 sm:p-4 rounded-xl w-full md:w-auto">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Distancia</span>
                  <input type="number" step="0.1" value={editDist} onChange={(e) => setEditDist(Number(e.target.value))} className="w-16 bg-iron-800 text-iron-accent font-bold text-center rounded-lg py-1 outline-none border border-iron-700 focus:border-iron-accent text-sm sm:text-base" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Minutos</span>
                  <input type="number" value={editDur} onChange={(e) => setEditDur(Number(e.target.value))} className="w-16 bg-iron-800 text-iron-accent font-bold text-center rounded-lg py-1 outline-none border border-iron-700 focus:border-iron-accent text-sm sm:text-base" />
                </div>
                <div className="flex items-center gap-2 w-full justify-center sm:w-auto sm:ml-2 mt-2 sm:mt-0">
                  <button onClick={() => handleSave(ex._id)} className="text-green-400 hover:text-green-300 p-1"><CheckCircle2 size={22} className="sm:w-6 sm:h-6"/></button>
                  <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300 p-1"><X size={22} className="sm:w-6 sm:h-6"/></button>
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-4 sm:gap-6 bg-iron-900 p-3 sm:p-4 rounded-xl justify-between sm:min-w-[200px] w-full md:w-auto">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-iron-accent font-black text-lg sm:text-xl">{ex.distance}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Km</span>
                </div>
                
                <div className="h-8 w-px bg-iron-700"></div>
                
                <div className="flex flex-col items-center flex-1">
                  <span className="text-iron-100 font-bold text-lg sm:text-xl">{ex.duration || 0}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Min</span>
                </div>
                
                <div className="hidden md:flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 shrink-0">
                  <button onClick={() => { setEditingId(ex._id); setEditDist(ex.distance || 0); setEditDur(ex.duration || 0); }} className="p-1.5 sm:p-2 bg-iron-800 rounded-lg text-gray-400 hover:text-iron-accent transition-colors" title="Editar">
                    <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button onClick={() => handleDelete(ex._id)} className="p-1.5 sm:p-2 bg-iron-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Borrar">
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            )}
            
          </div>
        ))}
      </div>
      
      {filteredExercises.length === 0 && (
        <div className="bg-iron-800 rounded-2xl p-8 text-center border-2 border-dashed border-iron-700">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs sm:text-sm">No hay rutas en esta categoría.</p>
        </div>
      )}
    </div>
  );
};