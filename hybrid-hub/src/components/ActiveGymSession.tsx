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
  onCancel: () => void;
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
      colors: ['#FFD369', '#EEEEEE', '#393E46']
    });
    onFinish(sessionExercises);
  };

  return (
    <div className="w-full bg-iron-800 rounded-2xl border-4 border-iron-900 shadow-2xl overflow-hidden animate-in slide-in-from-top duration-500">
      {/* Cabecera plana y oscura */}
      <div className="bg-iron-900 p-5 flex justify-between items-center border-b-2 border-iron-800">
        <div>
          <h3 className="font-black text-iron-100 uppercase tracking-tighter text-lg">Sesión Gym en curso</h3>
          <p className="text-iron-accent text-xs font-bold uppercase tracking-widest">En vivo • {sessionExercises.length} Ejercicios</p>
        </div>
        <div className="bg-iron-accent text-iron-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
          Active
        </div>
      </div>

      <div className="p-6 space-y-4 bg-iron-800">
        {sessionExercises.length === 0 ? (
          <p className="text-center text-gray-500 py-8 font-bold uppercase tracking-widest">No hay ejercicios seleccionados</p>
        ) : (
          sessionExercises.map((ex) => (
            <div key={ex._id} className="flex items-center justify-between p-4 bg-iron-900 rounded-xl border-2 border-transparent hover:border-iron-accent/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-iron-800 p-2 rounded-lg text-iron-accent">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-iron-100 text-lg uppercase leading-none">{ex.name}</h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase mt-1 tracking-widest">{ex.sets} x {ex.reps} Reps</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-iron-800 border-2 border-iron-700 rounded-xl px-4 py-2 focus-within:border-iron-accent transition-all">
                  <Weight size={18} className="text-iron-accent" />
                  <input 
                    type="number"
                    value={ex.weight}
                    onChange={(e) => updateWeight(ex._id, e.target.value)}
                    className="w-12 bg-transparent text-center font-black text-iron-100 outline-none text-lg"
                  />
                  <span className="text-[10px] font-black text-gray-500 uppercase">kg</span>
                </div>

                <button 
                  onClick={() => removeExercise(ex._id)}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}

        <button 
          onClick={onAddExercise}
          className="w-full py-4 mt-2 border-2 border-dashed border-iron-700 text-gray-400 hover:text-iron-accent hover:border-iron-accent font-black rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs"
        >
          <PlusCircle size={18} />
          Añadir Ejercicio
        </button>

        <button 
          onClick={handleFinish}
          disabled={sessionExercises.length === 0}
          className="w-full mt-6 bg-iron-accent text-iron-900 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl disabled:bg-gray-700 disabled:text-gray-500 uppercase tracking-widest"
        >
          <CheckCircle2 size={24} strokeWidth={3} />
          Finalizar Entrenamiento
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