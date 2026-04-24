import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface CardioTemplate {
  _id: string;
  name: string;
  cardioType: string;
  distance: number;
  duration?: number;
  pace?: number;
}

interface CardioSessionSelectorProps {
  onSessionStart: (selectedSessions: CardioTemplate[]) => void;
}

export const CardioSessionSelector = ({ onSessionStart }: CardioSessionSelectorProps) => {
  const { currentUser } = useAuth();
  
  const [sessions, setSessions] = useState<CardioTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/workouts?email=${currentUser?.email}`);
        if (response.ok) {
          const data = await response.json();
          const cardioSessions = data.filter((w: any) => w.category === "Cardio");
          setSessions(cardioSessions);
        }
      } catch (error) {
        console.error("Error al cargar sesiones de cardio", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.email) fetchLibrary();
  }, [currentUser]);

  const filteredSessions = sessions.filter((sess) => {
    const matchesSearch = sess.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "Todos" || sess.cardioType === typeFilter;
    return matchesSearch && matchesType;
  });

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleCreateSession = () => {
    const selectedSessions = sessions.filter(sess => selectedIds.includes(sess._id));
    onSessionStart(selectedSessions);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[80vh]">
      <div className="p-6 bg-white border-b border-gray-100 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Selecciona tu ruta</h2>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar sesión..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="Todos">Todos</option>
              <option value="Andar">Andar</option>
              <option value="Correr">Correr</option>
            </select>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2">
          <span>💡</span> Si tu ruta no está en la lista, recuerda crearla desde la página principal.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {loading ? (
          <p className="text-center text-gray-500">Cargando tu biblioteca...</p>
        ) : filteredSessions.length === 0 ? (
          <p className="text-center text-gray-500">No hay sesiones que coincidan.</p>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((sess) => (
              <label 
                key={sess._id} 
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedIds.includes(sess._id) ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(sess._id)}
                  onChange={() => toggleSelection(sess._id)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-bold text-gray-800">{sess.name}</h4>
                  <p className="text-sm text-gray-500">
                    {sess.cardioType === 'Andar' ? '🚶' : '🏃'} {sess.cardioType} • {sess.distance} km
                    {sess.duration ? ` • ${sess.duration} min` : ''}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
        <button 
          onClick={handleCreateSession}
          disabled={selectedIds.length === 0}
          className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Empezar sesión con {selectedIds.length} ruta(s)
        </button>
      </div>
    </div>
  );
};