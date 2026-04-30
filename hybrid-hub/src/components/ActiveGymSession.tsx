import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Weight, Trash2, PlusCircle, XCircle } from "lucide-react";
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
  
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customExercise, setCustomExercise] = useState({ name: "", sets: 3, reps: 10, weight: 0 });

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
    setCompletedExercises(prev => prev.filter(completedId => completedId !== id));
  };

  const toggleCompletion = (id: string) => {
    setCompletedExercises(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleAddCustom = () => {
    if (!customExercise.name.trim()) return alert("Ponle un nombre al ejercicio");
    
    const newEx: Exercise = {
      _id: `custom-${Date.now()}`,
      name: customExercise.name,
      bodyPart: "Personalizado",
      sets: customExercise.sets,
      reps: customExercise.reps,
      weight: customExercise.weight
    };
    
    setSessionExercises(prev => [...prev, newEx]);
    setIsAddingCustom(false);
    setCustomExercise({ name: "", sets: 3, reps: 10, weight: 0 });
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
          sessionExercises.map((ex) => {
            const isCompleted = completedExercises.includes(ex._id);
            
            return (
              <div key={ex._id} className={`flex items-center justify-between p-4 bg-iron-900 rounded-xl border-2 transition-all ${isCompleted ? 'border-iron-accent/50 opacity-75' : 'border-transparent hover:border-iron-accent/30'}`}>
                
                <div className="flex items-center gap-4">
                  {/* BOTÓN DE CHECK MODIFICADO */}
                  <button 
                    onClick={() => toggleCompletion(ex._id)}
                    className={`p-1 rounded-full transition-all hover:scale-110 active:scale-95 ${isCompleted ? 'text-iron-accent' : 'text-gray-600 hover:text-gray-400'}`}
                  >
                    {isCompleted ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <Circle size={28} strokeWidth={2.5} />}
                  </button>
                  
                  <div>
                    <h4 className={`font-bold text-lg uppercase leading-none transition-colors ${isCompleted ? 'text-gray-400 line-through decoration-iron-accent/50' : 'text-iron-100'}`}>
                      {ex.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase mt-1 tracking-widest">{ex.sets} x {ex.reps} Reps</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-iron-800 border-2 border-iron-700 rounded-xl px-3 py-2 focus-within:border-iron-accent transition-all">
                    <Weight size={16} className={isCompleted ? "text-gray-500" : "text-iron-accent"} />
                    <input 
                      type="number"
                      value={ex.weight}
                      onChange={(e) => updateWeight(ex._id, e.target.value)}
                      className="w-10 bg-transparent text-center font-black text-iron-100 outline-none text-lg"
                      disabled={isCompleted}
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
            );
          })
        )}

        {isAddingCustom && (
          <div className="p-4 bg-iron-900 rounded-xl border-2 border-iron-accent/50 space-y-3 animate-in fade-in zoom-in duration-200">
            <input
              type="text"
              placeholder="Nombre del ejercicio..."
              value={customExercise.name}
              onChange={(e) => setCustomExercise({...customExercise, name: e.target.value})}
              className="w-full bg-iron-800 border-2 border-iron-700 rounded-lg p-3 text-iron-100 font-bold outline-none focus:border-iron-accent"
              autoFocus
            />
            <div className="flex gap-2">
              <div className="flex-1 bg-iron-800 border-2 border-iron-700 rounded-lg p-2 flex flex-col">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center">Series</span>
                <input type="number" value={customExercise.sets} onChange={(e) => setCustomExercise({...customExercise, sets: Number(e.target.value)})} className="w-full bg-transparent text-center text-iron-100 font-bold outline-none mt-1" />
              </div>
              <div className="flex-1 bg-iron-800 border-2 border-iron-700 rounded-lg p-2 flex flex-col">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center">Reps</span>
                <input type="number" value={customExercise.reps} onChange={(e) => setCustomExercise({...customExercise, reps: Number(e.target.value)})} className="w-full bg-transparent text-center text-iron-100 font-bold outline-none mt-1" />
              </div>
              <div className="flex-1 bg-iron-800 border-2 border-iron-700 rounded-lg p-2 flex flex-col">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center">Peso (Kg)</span>
                <input type="number" value={customExercise.weight} onChange={(e) => setCustomExercise({...customExercise, weight: Number(e.target.value)})} className="w-full bg-transparent text-center text-iron-100 font-bold outline-none mt-1" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsAddingCustom(false)} className="flex-1 py-3 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-red-400 transition-colors bg-iron-800 rounded-lg">Cancelar</button>
              <button onClick={handleAddCustom} className="flex-1 py-3 bg-iron-accent text-iron-900 rounded-lg font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform">Guardar y Añadir</button>
            </div>
          </div>
        )}

        {!isAddingCustom && (
          <div className="flex gap-3 mt-2">
            <button 
              onClick={onAddExercise}
              className="flex-1 py-4 border-2 border-dashed border-iron-700 text-gray-400 hover:text-iron-accent hover:border-iron-accent font-black rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]"
            >
              <PlusCircle size={16} />
              Biblioteca
            </button>
            <button 
              onClick={() => setIsAddingCustom(true)}
              className="flex-1 py-4 border-2 border-dashed border-iron-700 text-gray-400 hover:text-iron-accent hover:border-iron-accent font-black rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]"
            >
              <PlusCircle size={16} />
              Crear Rápido
            </button>
          </div>
        )}

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