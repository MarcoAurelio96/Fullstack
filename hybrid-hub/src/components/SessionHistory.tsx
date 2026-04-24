import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Dumbbell, Activity, Clock, Route } from "lucide-react";

// Definimos la forma de los datos que vienen de MongoDB
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

    if (currentUser?.email) {
      fetchHistory();
    }
  }, [currentUser]);

  // Función para poner la fecha (Ej: "Viernes, 24 de abril de 2026")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-12 font-medium animate-pulse">Cargando tu historial de sudor y lágrimas... 💦</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
        <CalendarDays size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no hay entrenamientos</h3>
        <p className="text-gray-500">Tus sesiones completadas aparecerán aquí. ¡Hora de entrenar!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 mt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <CalendarDays className="text-blue-600" /> 
        Tu Historial de Entrenamientos
      </h2>

      {sessions.map((session) => (
        <div key={session._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          
          {/* Cabecera de la tarjeta (Fecha y Tipo) */}
          <div className={`p-4 border-b flex justify-between items-center ${session.sessionType === 'Gym' ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white shadow-sm ${session.sessionType === 'Gym' ? 'text-blue-600' : 'text-green-600'}`}>
                {session.sessionType === 'Gym' ? <Dumbbell size={24} /> : <Activity size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 capitalize">{formatDate(session.date)}</h3>
                <p className={`text-sm font-semibold ${session.sessionType === 'Gym' ? 'text-blue-600' : 'text-green-600'}`}>
                  Sesión de {session.sessionType}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500 font-medium">
              {session.exercises.length} {session.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
            </div>
          </div>

          {/* Lista de ejercicios de ese día */}
          <div className="p-4 bg-white">
            <ul className="space-y-3">
              {session.exercises.map((ex, index) => (
                <li key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold w-6">{index + 1}.</span>
                    <div>
                      <p className="font-bold text-gray-800">{ex.name}</p>
                      {session.sessionType === 'Gym' && (
                        <p className="text-xs text-gray-500">{ex.bodyPart}</p>
                      )}
                      {session.sessionType === 'Cardio' && (
                        <p className="text-xs text-gray-500 capitalize">{ex.cardioType}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-semibold text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    {session.sessionType === 'Gym' ? (
                      <>
                        <span>{ex.sets} x {ex.reps}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-blue-600">{ex.weight} kg</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1"><Route size={16} className="text-gray-400"/> {ex.distance} km</span>
                        {ex.duration && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1 text-green-600"><Clock size={16}/> {ex.duration} min</span>
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