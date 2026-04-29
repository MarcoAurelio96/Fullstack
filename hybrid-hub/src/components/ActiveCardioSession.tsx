import { useState } from "react";
import { CheckCircle2, Timer, Route, XCircle } from "lucide-react";
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
  onCancel: () => void;
}

export const ActiveCardioSession = ({ exercises, onFinish, onCancel }: ActiveCardioSessionProps) => {
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
      colors: ['#FFD369', '#EEEEEE', '#393E46']
    });
    onFinish(sessionExercises);
  };

  return (
    <div className="w-full bg-iron-800 rounded-2xl border-4 border-iron-900 shadow-2xl overflow-hidden animate-in slide-in-from-top duration-500">
      <div className="bg-iron-900 p-5 flex justify-between items-center border-b-2 border-iron-800">
        <div>
          <h3 className="font-black text-iron-100 uppercase tracking-tighter text-lg">Sesión Cardio en curso</h3>
          <p className="text-iron-accent text-xs font-bold uppercase tracking-widest">En ruta • GPS Activo</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {sessionExercises.map((ex) => (
          <div key={ex._id} className="bg-iron-900 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-transparent transition-all hover:border-iron-accent/30">
            
            <div className="flex items-center gap-4">
              <div className="bg-iron-800 p-3 rounded-xl text-iron-accent">
                <Route size={24} strokeWidth={3} />
              </div>
              <div>
                <h4 className="font-black text-iron-100 text-xl uppercase leading-none">{ex.name}</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{ex.cardioType}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto">
              {/* INPUT DISTANCIA */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-iron-accent uppercase tracking-widest">KM</span>
                <div className="bg-iron-800 border-2 border-iron-700 rounded-xl px-4 py-2 flex items-center">
                   <input 
                    type="number"
                    value={ex.distance}
                    onChange={(e) => updateField(ex._id, 'distance', e.target.value)}
                    className="w-16 bg-transparent text-center font-black text-iron-100 outline-none text-xl"
                    step="0.1"
                  />
                </div>
              </div>

              {/* INPUT DURACIÓN */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-iron-accent uppercase tracking-widest">MIN</span>
                <div className="bg-iron-800 border-2 border-iron-700 rounded-xl px-4 py-2 flex items-center gap-2">
                   <Timer size={16} className="text-gray-500" />
                   <input 
                    type="number"
                    value={ex.duration || ''}
                    placeholder="0"
                    onChange={(e) => updateField(ex._id, 'duration', e.target.value)}
                    className="w-14 bg-transparent text-center font-black text-iron-100 outline-none text-xl"
                  />
                </div>
              </div>
            </div>

          </div>
        ))}

        <button 
          onClick={handleFinish}
          className="w-full mt-6 bg-iron-accent text-iron-900 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl uppercase tracking-widest"
        >
          <CheckCircle2 size={24} strokeWidth={3} />
          Finalizar y Guardar Ruta
        </button>

        <button 
          onClick={onCancel}
          className="w-full mt-2 text-red-500 hover:bg-red-500/10 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs"
        >
          <XCircle size={18} />
          Cancelar Sesión
        </button>
      </div>
    </div>
  );
};