import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Dumbbell, Activity, Clock, Route, Trash2, Filter } from "lucide-react";

interface Exercise {
  _id: string;
  name: string;
  bodyPart?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  cardioType?: string;
  distance?: number;
  duration?: number;
}

interface SessionData {
  _id: string;
  sessionType: "Gym" | "Cardio";
  date: string;
  exercises: Exercise[];
}

export const SessionHistory = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"Todos" | "Gym" | "Cardio">("Todos");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sessions?email=${currentUser?.email}`);
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error("Error al cargar el historial", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.email) fetchHistory();
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres borrar este entrenamiento de tu historial? Esta acción no se puede deshacer.");
    
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/sessions/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSessions(prevSessions => prevSessions.filter(session => session._id !== id));
        } else {
          console.error("Error al borrar la sesión del servidor");
        }
      } catch (error) {
        console.error("Error de red al intentar borrar:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) return <div className="text-center text-iron-accent py-12 font-medium animate-pulse">Cargando tu historial de sudor y lágrimas... 💦</div>;

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 bg-iron-800 rounded-none sm:rounded-2xl mt-8">
        <CalendarDays size={64} className="mx-auto text-iron-accent mb-4" />
        <h3 className="text-xl font-bold text-iron-100 mb-2 uppercase">Aún no hay entrenamientos</h3>
        <p className="text-gray-400">Tus sesiones completadas aparecerán aquí. ¡Hora de entrenar!</p>
      </div>
    );
  }

  const filteredSessions = sessions.filter(session => {
    if (filter === "Todos") return true;
    return session.sessionType === filter;
  });

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 mt-4">
      
      {/* Cabecera y Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-iron-100 flex items-center gap-3 uppercase tracking-tight">
          <CalendarDays className="text-iron-accent" size={28} /> 
          Tu Historial
        </h2>

        {/* BOTONES DE FILTRADO (Adaptados al tema Dark Flat) */}
        <div className="flex items-center gap-2 bg-iron-800 p-1 rounded-xl">
          <button
            onClick={() => setFilter("Todos")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              filter === "Todos" ? "bg-iron-accent text-iron-900" : "text-gray-400 hover:text-iron-100"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("Gym")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              filter === "Gym" ? "bg-iron-accent text-iron-900" : "text-gray-400 hover:text-iron-100"
            }`}
          >
            <Dumbbell size={16} /> Gym
          </button>
          <button
            onClick={() => setFilter("Cardio")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              filter === "Cardio" ? "bg-iron-accent text-iron-900" : "text-gray-400 hover:text-iron-100"
            }`}
          >
            <Activity size={16} /> Cardio
          </button>
        </div>
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12 bg-iron-800 rounded-2xl border-2 border-dashed border-iron-700">
          <Filter size={40} className="mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400 font-medium">No tienes sesiones de este tipo todavía.</p>
        </div>
      )}

      {filteredSessions.map((session) => (
        // TARJETA DE SESIÓN: Ahora es oscura (bg-iron-800)
        <div key={session._id} className="bg-iron-800 rounded-2xl overflow-hidden transition-all relative group">
          
          {/* CABECERA DE LA TARJETA */}
          <div className="p-4 border-b-4 border-iron-900 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-iron-900 text-iron-accent">
                {session.sessionType === 'Gym' ? <Dumbbell size={24} /> : <Activity size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-iron-100 capitalize text-lg">{formatDate(session.date)}</h3>
                <p className="text-sm font-bold text-iron-accent uppercase tracking-wider">
                  Sesión de {session.sessionType}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 font-medium hidden sm:inline-block">
                {session.exercises.length} {session.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
              </span>
              <button 
                onClick={() => handleDelete(session._id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-iron-900 rounded-xl transition-colors"
                title="Borrar sesión del historial"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* LISTA DE EJERCICIOS */}
          <div className="p-4">
            <ul className="space-y-3">
              {session.exercises.map((ex, index) => (
                <li key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-iron-900 gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-iron-accent font-black text-lg w-6">{index + 1}.</span>
                    <div>
                      <p className="font-bold text-iron-100 text-lg">{ex.name}</p>
                      {session.sessionType === 'Gym' && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{ex.bodyPart}</p>}
                      {session.sessionType === 'Cardio' && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{ex.cardioType}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-bold text-iron-100 bg-iron-800 px-4 py-3 rounded-xl self-start sm:self-auto">
                    {session.sessionType === 'Gym' ? (
                      <>
                        <span>{ex.sets} x {ex.reps}</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-iron-accent">{ex.weight} kg</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-2"><Route size={18} className="text-gray-400"/> {ex.distance} km</span>
                        {ex.duration && (
                          <>
                            <span className="text-gray-600">|</span>
                            <span className="flex items-center gap-2 text-iron-accent"><Clock size={18}/> {ex.duration} min</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};