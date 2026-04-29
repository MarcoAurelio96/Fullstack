import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Workout {
  _id: string;
  type: string;
  duration: number;
  distance?: number;
  createdAt: string;
}

export const WorkoutList = () => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/workouts?email=${currentUser?.email}`);
        
        if (!response.ok) throw new Error("Error al cargar los datos");
        
        const data = await response.json();
        setWorkouts(data);
      } catch (err) {
        setError("No se pudieron cargar los entrenamientos.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.email) {
      fetchWorkouts();
    }
  }, [currentUser]);

  if (loading) return <div className="text-gray-500 text-center p-6">Cargando tu historial...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;
  if (workouts.length === 0) return <div className="text-gray-500 text-center p-6">Aún no tienes entrenamientos registrados. ¡Anímate!</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Historial</h3>
      
      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
        {workouts.map((workout) => (
          <div key={workout._id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800 text-lg">
                {workout.type === "Correr" && "🏃‍♂️"}
                {workout.type === "Andar" && "🚶‍♂️"}
                {workout.type === "Fuerza" && "🏋️‍♂️"} {workout.type}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(workout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600">{workout.duration} min</p>
              {workout.distance && <p className="text-sm text-gray-600">{workout.distance} km</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};