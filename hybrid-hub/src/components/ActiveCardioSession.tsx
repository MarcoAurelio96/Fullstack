import { useState } from "react";
import { CheckCircle2, ChevronRight, Timer, Route } from "lucide-react";
import confetti from "canvas-confetti";

interface CardioExercise {
  _id: string;
  name: string;
  cardioType: string;
  distance: number;
  duration?: number;
}

interface ActiveCardioSessionProps {
  exercises: CardioExercise[];
  onFinish: (finalExercises: CardioExercise[]) => void;
}

export const ActiveCardioSession = ({ exercises, onFinish }: ActiveCardioSessionProps) => {
  const [sessionExercises, setSessionExercises] = useState(exercises);

  const updateField = (id: string, field: 'distance' | 'duration', value: string) => {
    setSessionExercises(prev => 
      prev.map(ex => ex._id === id ? { ...ex, [field]: Number(value) } : ex)
    );
  };

  const handleFinish = () => {
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
          <h3 className="font-bold text-lg">Sesión de Cardio en curso 🏃‍♂️</h3>
          <p className="text-blue-100 text-xs">Ajusta la distancia o el tiempo final</p>
        </div>
        <div className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          En vivo
        </div>
      </div>

      <div className="p-6 space-y-4">
        {sessionExercises.map((ex) => (
          <div key={ex._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
            
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                <ChevronRight size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{ex.name}</h4>
                <p className="text-xs text-gray-500">{ex.cardioType}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto">
              {/* Input Distancia */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Route size={16} className="text-gray-400" />
                <input 
                  type="number"
                  value={ex.distance}
                  onChange={(e) => updateField(ex._id, 'distance', e.target.value)}
                  className="w-16 text-center font-bold text-gray-700 outline-none"
                  step="0.1"
                />
                <span className="text-xs font-bold text-gray-400">km</span>
              </div>

              {/* Input Duración */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Timer size={16} className="text-gray-400" />
                <input 
                  type="number"
                  value={ex.duration || ''}
                  placeholder="0"
                  onChange={(e) => updateField(ex._id, 'duration', e.target.value)}
                  className="w-12 text-center font-bold text-gray-700 outline-none"
                />
                <span className="text-xs font-bold text-gray-400">min</span>
              </div>
            </div>

          </div>
        ))}

        <button 
          onClick={handleFinish}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <CheckCircle2 size={24} />
          FINALIZAR Y GUARDAR RUTA
        </button>
      </div>
    </div>
  );
};