import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Filter, CheckCircle2, Dumbbell, ChevronDown } from "lucide-react";

interface Exercise {
  _id: string;
  name: string;
  bodyPart: string;
  sets: number;
  reps: number;
  weight: number;
}

interface GymSessionSelectorProps {
  onSessionStart: (exercises: Exercise[]) => void;
}

export const GymSessionSelector = ({ onSessionStart }: GymSessionSelectorProps) => {
  const { currentUser } = useAuth();
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPart, setFilterPart] = useState("Todos");

  const bodyParts = ["Pecho", "Biceps", "Triceps", "Espalda", "Hombro", "Pierna"];

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch(`/api/workouts?email=${currentUser?.email}`);
        if (response.ok) {
          const data = await response.json();
          setLibrary(data.filter((ex: any) => ex.bodyPart));
        }
      } catch (error) {
        console.error("Error al cargar biblioteca:", error);
      }
    };
    if (currentUser?.email) fetchLibrary();
  }, [currentUser]);

  const toggleExercise = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredLibrary = library.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPart === "Todos" || ex.bodyPart.toLowerCase() === filterPart.toLowerCase())
  );

  const handleStart = () => {
    const selectedExercises = library.filter(ex => selectedIds.includes(ex._id));
    onSessionStart(selectedExercises);
  };

  return (
    <div className="p-6 bg-iron-800">
      <h3 className="text-2xl font-black text-iron-100 uppercase tracking-tight mb-6 flex items-center gap-3">
        <Dumbbell className="text-iron-accent" /> Selecciona Ejercicios
      </h3>

      <div className="space-y-4 mb-6">
        {/* BUSCADOR */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Buscar ejercicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl pl-12 pr-4 py-3 text-iron-100 outline-none focus:border-iron-accent transition-all"
          />
        </div>

        {/* FILTROS: BOTÓN TODOS + DESPLEGABLE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterPart("Todos")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex-shrink-0 border-2 ${
              filterPart === "Todos" 
                ? "bg-iron-accent border-iron-accent text-iron-900 shadow-[0_0_15px_rgba(255,211,105,0.2)]" 
                : "bg-iron-900 border-iron-700 text-gray-500 hover:border-gray-600"
            }`}
          >
            Todos
          </button>

          <div className="relative flex-grow">
            <Filter className={`absolute left-4 top-3.5 transition-colors ${filterPart !== "Todos" ? "text-iron-accent" : "text-gray-500"}`} size={18} />
            <select
              value={filterPart === "Todos" ? "" : filterPart}
              onChange={(e) => setFilterPart(e.target.value || "Todos")}
              className={`w-full bg-iron-900 border-2 rounded-xl pl-12 pr-10 py-3 text-iron-100 outline-none transition-all appearance-none font-bold text-sm cursor-pointer ${
                filterPart !== "Todos" ? "border-iron-accent" : "border-iron-700 focus:border-iron-accent"
              }`}
            >
              <option value="" disabled className="text-gray-600">Filtrar por músculo...</option>
              {bodyParts.map(part => (
                <option key={part} value={part} className="bg-iron-800 text-iron-100">
                  {part}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* LISTADO DE EJERCICIOS */}
      <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {filteredLibrary.length > 0 ? (
          filteredLibrary.map(ex => (
            <div 
              key={ex._id}
              onClick={() => toggleExercise(ex._id)}
              className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between ${
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
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ex.bodyPart} • {ex.weight}kg</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-iron-700 rounded-2xl">
            <p className="text-gray-500 font-bold uppercase text-xs">No se encontraron ejercicios</p>
          </div>
        )}
      </div>

      {/* BOTÓN ACCIÓN FINAL */}
      <button 
        onClick={handleStart}
        disabled={selectedIds.length === 0}
        className="w-full mt-6 bg-iron-accent text-iron-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 disabled:grayscale"
      >
        Empezar Sesión ({selectedIds.length})
      </button>
    </div>
  );
};