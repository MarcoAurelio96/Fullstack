import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, Weight, Trash2, PlusCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface Exercise {
  _id: string;
  name: string;
  bodyPart: string;
  sets: number;
  reps: number;
  weight: number;
}

interface ActiveGymSessionProps {
  exercises: Exercise[];
  onFinish: (finalExercises: Exercise[]) => void;
  onAddExercise: () => void;
  onCancel: () => void; // NUEVO
}

export const ActiveGymSession = ({ exercises, onFinish, onAddExercise, onCancel }: ActiveGymSessionProps) => {
  const [sessionExercises, setSessionExercises] = useState(exercises);

  useEffect(() => {
    setSessionExercises(exercises);
  }, [exercises]);

  const updateWeight = (id: string, newWeight: string) => {
    setSessionExercises(prev => 
      prev.map(ex => ex._id === id ? { ...ex, weight: Number(newWeight) } : ex)
    );
  };

  const removeExercise = (id: string) => {
    setSessionExercises(prev => prev.filter(ex => ex._id !== id));
  };

  const handleFinish = () => {
    if (sessionExercises.length === 0) return;
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#3b82f6', '#60a5fa']
    });
    onFinish(sessionExercises);
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-blue-500 shadow-lg overflow-hidden animate-in slide-in-from-top duration-500">
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Sesión de Gym en curso 🏋️‍♂️</h3>
          <p className="text-blue-100 text-xs">Puedes ajustar los pesos sobre la marcha</p>
        </div>
        <div className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          En vivo
        </div>
      </div>

      <div className="p-6 space-y-4">
        {sessionExercises.length === 0 ? (
          <p className="text-center text-gray-500 py-4 font-medium">No hay ejercicios en esta sesión.</p>
        ) : (
          sessionExercises.map((ex) => (
            <div key={ex._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group transition-all hover:border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                  <ChevronRight size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{ex.name}</h4>
                  <p className="text-xs text-gray-500">{ex.sets} series x {ex.reps} reps</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Weight size={16} className="text-gray-400" />
                  <input 
                    type="number"
                    value={ex.weight}
                    onChange={(e) => updateWeight(ex._id, e.target.value)}
                    className="w-12 text-center font-bold text-gray-700 outline-none"
                  />
                  <span className="text-xs font-bold text-gray-400">kg</span>
                </div>

                <button 
                  onClick={() => removeExercise(ex._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Quitar ejercicio de hoy"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}

        <button 
          onClick={onAddExercise}
          className="w-full py-3.5 mt-2 border-2 border-dashed border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle size={20} />
          Añadir otro ejercicio
        </button>

        <button 
          onClick={handleFinish}
          disabled={sessionExercises.length === 0}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-md disabled:bg-gray-300 disabled:transform-none disabled:shadow-none"
        >
          <CheckCircle2 size={24} />
          FINALIZAR Y GUARDAR SESIÓN
        </button>

        {/* NUEVO: Botón Cancelar */}
        <button 
          onClick={onCancel}
          className="w-full mt-2 text-red-400 hover:text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <XCircle size={20} />
          Cancelar Sesión
        </button>
      </div>
    </div>
  );
};