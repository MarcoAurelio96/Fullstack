import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface WorkoutTemplate {
  _id: string;
  name: string;
  bodyPart: string;
  sets: number;
  reps: number;
  weight: number;
}

interface GymSessionSelectorProps {
  onSessionStart: (selectedExercises: WorkoutTemplate[]) => void;
}

export const GymSessionSelector = ({ onSessionStart }: GymSessionSelectorProps) => {
  const { currentUser } = useAuth();
  
  // Estados para los datos y filtros
  const [exercises, setExercises] = useState<WorkoutTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bodyPartFilter, setBodyPartFilter] = useState("Todos");
  
  // Estado para los ejercicios marcados con el checkbox
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar la "Biblioteca" de ejercicios desde MongoDB
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/workouts?email=${currentUser?.email}`);
        if (response.ok) {
          const data = await response.json();
          // Filtramos solo los de Gym para este selector
          const gymExercises = data.filter((w: any) => w.category === "Gym");
          setExercises(gymExercises);
        }
      } catch (error) {
        console.error("Error al cargar ejercicios", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.email) fetchLibrary();
  }, [currentUser]);

  // 2. Lógica de los filtros (Nombre y Parte del cuerpo)
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = bodyPartFilter === "Todos" || ex.bodyPart === bodyPartFilter;
    return matchesSearch && matchesBodyPart;
  });

  // 3. Manejar los checkboxes
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleCreateSession = () => {
    // Buscamos los objetos completos de los IDs seleccionados
    const selectedExercises = exercises.filter(ex => selectedIds.includes(ex._id));
    onSessionStart(selectedExercises);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[80vh]">
      
      {/* Cabecera y Filtros fijos arriba */}
      <div className="p-6 bg-white border-b border-gray-100 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Selecciona tus ejercicios</h2>
        
        <div className="flex gap-4">
          {/* Buscador por Nombre */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar ejercicio..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Filtro por Parte del cuerpo */}
          <div className="relative w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={bodyPartFilter}
              onChange={(e) => setBodyPartFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="Todos">Todos</option>
              <option value="Pecho">Pecho</option>
              <option value="Biceps">Bíceps</option>
              <option value="Triceps">Tríceps</option>
              <option value="Espalda">Espalda</option>
              <option value="Pierna">Pierna</option>
            </select>
          </div>
        </div>

        {/* Mensaje fijo recordatorio */}
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2">
          <span>💡</span> Si tu ejercicio no está en la lista, recuerda crearlo desde la página principal.
        </div>
      </div>

      {/* Lista scrolleable de ejercicios (Checkbox hueco) */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {loading ? (
          <p className="text-center text-gray-500">Cargando tu biblioteca...</p>
        ) : filteredExercises.length === 0 ? (
          <p className="text-center text-gray-500">No hay ejercicios que coincidan.</p>
        ) : (
          <div className="space-y-3">
            {filteredExercises.map((ex) => (
              <label 
                key={ex._id} 
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedIds.includes(ex._id) ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(ex._id)}
                  onChange={() => toggleSelection(ex._id)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-bold text-gray-800">{ex.name}</h4>
                  <p className="text-sm text-gray-500">{ex.bodyPart} • {ex.sets}x{ex.reps} • {ex.weight}kg</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Botón final fijo abajo */}
      <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
        <button 
          onClick={handleCreateSession}
          disabled={selectedIds.length === 0}
          className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Crear sesión con {selectedIds.length} ejercicios
        </button>
      </div>

    </div>
  );
};