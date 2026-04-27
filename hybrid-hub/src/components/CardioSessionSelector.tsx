import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, Activity, Route } from "lucide-react";

interface CardioExercise {
  _id: string;
  name: string;
  cardioType: string;
  distance: number;
  duration?: number;
}

interface CardioSessionSelectorProps {
  onSessionStart: (exercises: CardioExercise[]) => void;
}

export const CardioSessionSelector = ({ onSessionStart }: CardioSessionSelectorProps) => {
  const { currentUser } = useAuth();
  const [library, setLibrary] = useState<CardioExercise[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("Todos");

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/workouts?email=${currentUser?.email}`);
        if (response.ok) {
          const data = await response.json();
          setLibrary(data.filter((ex: any) => ex.cardioType));
        }
      } catch (error) {
        console.error("Error al cargar rutas:", error);
      }
    };
    if (currentUser?.email) fetchLibrary();
  }, [currentUser]);

  const toggleExercise = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredLibrary = library.filter(ex => 
    filterType === "Todos" || ex.cardioType?.toLowerCase() === filterType.toLowerCase()
  );

  const handleStart = () => {
    const selected = library.filter(ex => selectedIds.includes(ex._id));
    onSessionStart(selected);
  };

  return (
    <div className="p-6 bg-iron-800">
      <h3 className="text-2xl font-black text-iron-100 uppercase tracking-tight mb-6 flex items-center gap-3">
        <Activity className="text-iron-accent" /> Selecciona Tipo
      </h3>

      {/* FILTROS: Ajustado con padding lateral para alinear con las tarjetas de abajo */}
      <div className="px-0.5 mb-6"> 
        <div className="grid grid-cols-3 gap-3">
          {["Todos", "Correr", "Andar"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`py-3 rounded-xl text-xs font-black uppercase transition-all border-2 text-center ${
                filterType === type 
                  ? "bg-iron-accent border-iron-accent text-iron-900 shadow-[0_0_15px_rgba(255,211,105,0.2)]" 
                  : "bg-iron-900 border-iron-700 text-gray-500 hover:border-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE EJERCICIOS */}
      <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {filteredLibrary.length > 0 ? (
          filteredLibrary.map(ex => (
            <div 
              key={ex._id}
              onClick={() => toggleExercise(ex._id)}
              className={`mx-0.5 p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between ${
                selectedIds.includes(ex._id) 
                  ? "bg-iron-900 border-iron-accent" 
                  : "bg-iron-900 border-iron-700 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  selectedIds.includes(ex._id) ? "bg-iron-accent border-iron-accent" : "border-iron-700"
                }`}>
                  {selectedIds.includes(ex._id) && <CheckCircle2 size={16} className="text-iron-900" />}
                </div>
                <div>
                  <p className="font-bold text-iron-100 uppercase text-sm">{ex.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1 tracking-widest">
                    <Route size={10}/> {ex.distance}km • {ex.cardioType}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mx-0.5 text-center py-10 border-2 border-dashed border-iron-700 rounded-2xl">
            <p className="text-gray-500 font-bold uppercase text-xs">No hay rutas guardadas</p>
          </div>
        )}
      </div>

      <button 
        onClick={handleStart}
        disabled={selectedIds.length === 0}
        className="w-full mt-6 bg-iron-accent text-iron-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
      >
        Empezar Actividad ({selectedIds.length})
      </button>
    </div>
  );
};