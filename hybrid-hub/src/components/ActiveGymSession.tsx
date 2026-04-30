import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Weight, Trash2, PlusCircle, XCircle, Loader2, Timer, Play, Pause, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";

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
  const { currentUser } = useAuth(); 
  
  const [sessionExercises, setSessionExercises] = useState(exercises);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  
  const [customExercise, setCustomExercise] = useState({ 
    name: "", 
    bodyPart: "Pecho", 
    sets: 3, 
    reps: 10, 
    weight: 0 
  });

  const bodyParts = ["Pecho", "Biceps", "Triceps", "Espalda", "Hombro", "Pierna"];


  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restPerSet, setRestPerSet] = useState(90); 
  const [restPerExercise, setRestPerExercise] = useState(180);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRest = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

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

  const handleAddCustom = async () => {
    if (!customExercise.name.trim()) return alert("Ponle un nombre al ejercicio");
    if (!currentUser?.email) return alert("No se detecta el usuario");
    
    setIsSavingCustom(true);

    try {
      const newWorkout = {
        userEmail: currentUser.email,
        type: "Gym",
        category: "Gym",
        name: customExercise.name,
        bodyPart: customExercise.bodyPart,
        sets: Number(customExercise.sets),
        reps: Number(customExercise.reps),
        weight: Number(customExercise.weight)
      };

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkout)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al guardar");
      }

      const savedWorkout = await response.json();

      const newEx: Exercise = {
        _id: savedWorkout._id, 
        name: savedWorkout.name,
        bodyPart: savedWorkout.bodyPart,
        sets: customExercise.sets,
        reps: customExercise.reps,
        weight: customExercise.weight
      };
      
      setSessionExercises(prev => [...prev, newEx]);
      setIsAddingCustom(false);
      setCustomExercise({ name: "", bodyPart: "Pecho", sets: 3, reps: 10, weight: 0 }); 
    } catch (error) {
      console.error("Error creando ejercicio rápido:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsSavingCustom(false);
    }
  };

  const handleFinish = () => {
    if (sessionExercises.length === 0) return;
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD369', '#EEEEEE', '#393E46'] });
    onFinish(sessionExercises);
  };

  return (
    <div className="w-full bg-iron-800 rounded-2xl border-4 border-iron-900 shadow-2xl overflow-hidden animate-in slide-in-from-top duration-500 relative flex flex-col max-h-[85vh]">
      
      {/* CABECERA */}
      <div className="bg-iron-900 p-5 flex justify-between items-center border-b-2 border-iron-800 shrink-0 z-20 relative">
        <div>
          <h3 className="font-black text-iron-100 uppercase tracking-tighter text-lg">Sesión Gym en curso</h3>
          <p className="text-iron-accent text-xs font-bold uppercase tracking-widest">En vivo • {sessionExercises.length} Ejercicios</p>
        </div>
        <div className="flex items-center gap-3">
          {/* BOTÓN PARA ABRIR/CERRAR EL CRONÓMETRO */}
          <button 
            onClick={() => setShowTimer(!showTimer)}
            className={`p-2 rounded-xl transition-colors ${showTimer ? 'bg-iron-accent text-iron-900' : 'bg-iron-800 text-iron-accent hover:bg-iron-700'}`}
            title="Temporizador de descanso"
          >
            <Timer size={20} strokeWidth={2.5} />
          </button>
          <div className="bg-iron-accent text-iron-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hidden sm:block">
            Active
          </div>
        </div>
      </div>

      {/* LISTA DE EJERCICIOS */}
      <div className="p-6 space-y-4 bg-iron-800 overflow-y-auto flex-grow relative z-0 pb-32">
        {sessionExercises.length === 0 ? (
          <p className="text-center text-gray-500 py-8 font-bold uppercase tracking-widest">No hay ejercicios seleccionados</p>
        ) : (
          sessionExercises.map((ex) => {
            const isCompleted = completedExercises.includes(ex._id);
            return (
              <div key={ex._id} className={`flex items-center justify-between p-4 bg-iron-900 rounded-xl border-2 transition-all ${isCompleted ? 'border-iron-accent/50 opacity-75' : 'border-transparent hover:border-iron-accent/30'}`}>
                <div className="flex items-center gap-4">
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
                    <p className="text-[10px] text-gray-500 font-black uppercase mt-1 tracking-widest">{ex.sets} x {ex.reps} Reps • {ex.bodyPart}</p>
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
                  <button onClick={() => removeExercise(ex._id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {isAddingCustom && (
          <div className="p-4 bg-iron-900 rounded-xl border-2 border-iron-accent/50 space-y-3 animate-in fade-in zoom-in duration-200">
            <input type="text" placeholder="Nombre del ejercicio..." value={customExercise.name} onChange={(e) => setCustomExercise({...customExercise, name: e.target.value})} className="w-full bg-iron-800 border-2 border-iron-700 rounded-lg p-3 text-iron-100 font-bold outline-none focus:border-iron-accent" autoFocus />
            <select value={customExercise.bodyPart} onChange={(e) => setCustomExercise({...customExercise, bodyPart: e.target.value})} className="w-full bg-iron-800 border-2 border-iron-700 rounded-lg p-3 text-iron-100 font-bold outline-none focus:border-iron-accent appearance-none cursor-pointer">
              {bodyParts.map(part => <option key={part} value={part}>{part}</option>)}
            </select>
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
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center">Peso</span>
                <input type="number" value={customExercise.weight} onChange={(e) => setCustomExercise({...customExercise, weight: Number(e.target.value)})} className="w-full bg-transparent text-center text-iron-100 font-bold outline-none mt-1" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsAddingCustom(false)} className="flex-1 py-3 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-red-400 transition-colors bg-iron-800 rounded-lg">Cancelar</button>
              <button onClick={handleAddCustom} disabled={isSavingCustom} className="flex-1 py-3 bg-iron-accent text-iron-900 rounded-lg font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform flex justify-center items-center gap-2 disabled:opacity-50">
                {isSavingCustom ? <Loader2 size={14} className="animate-spin" /> : null} Guardar
              </button>
            </div>
          </div>
        )}

        {!isAddingCustom && (
          <div className="flex gap-3 mt-2">
            <button onClick={onAddExercise} className="flex-1 py-4 border-2 border-dashed border-iron-700 text-gray-400 hover:text-iron-accent hover:border-iron-accent font-black rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]">
              <PlusCircle size={16} /> Biblioteca
            </button>
            <button onClick={() => setIsAddingCustom(true)} className="flex-1 py-4 border-2 border-dashed border-iron-700 text-gray-400 hover:text-iron-accent hover:border-iron-accent font-black rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]">
              <PlusCircle size={16} /> Crear Rápido
            </button>
          </div>
        )}

        <button onClick={handleFinish} disabled={sessionExercises.length === 0} className="w-full mt-6 bg-iron-accent text-iron-900 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl disabled:bg-gray-700 disabled:text-gray-500 uppercase tracking-widest">
          <CheckCircle2 size={24} strokeWidth={3} /> Finalizar Entrenamiento
        </button>

        <button onClick={onCancel} className="w-full mt-2 text-red-500 hover:bg-red-500/10 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs">
          <XCircle size={18} /> Cancelar Sesión
        </button>
      </div>

      {/* PANEL DEL CRONÓMETRO */}
      {showTimer && (
        <div className="absolute bottom-0 left-0 w-full bg-iron-900 border-t-4 border-iron-800 p-4 rounded-b-xl z-50 animate-in slide-in-from-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto w-full">
            
            {/* Display del Tiempo y controles manuales */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
              <span className={`text-4xl font-black tabular-nums transition-colors ${timeLeft > 0 && timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-iron-accent'}`}>
                {formatTime(timeLeft)}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)} 
                  disabled={timeLeft === 0}
                  className="bg-iron-800 p-3 rounded-xl text-iron-100 hover:text-iron-accent disabled:opacity-50 transition-colors"
                >
                  {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button 
                  onClick={() => { setTimeLeft(0); setIsTimerRunning(false); }}
                  className="bg-iron-800 p-3 rounded-xl text-iron-100 hover:text-red-400 transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => startRest(restPerSet)} 
                  className="flex-1 sm:flex-none bg-iron-800 border-2 border-iron-700 hover:border-iron-accent text-iron-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Descanso Serie
                </button>
                <button 
                  onClick={() => startRest(restPerExercise)} 
                  className="flex-1 sm:flex-none bg-iron-800 border-2 border-iron-700 hover:border-iron-accent text-iron-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Descanso Ejerc.
                </button>
              </div>

              <div className="hidden sm:flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Serie (seg)</span>
                  <input type="number" value={restPerSet} onChange={(e)=>setRestPerSet(Number(e.target.value))} className="w-14 bg-iron-800 text-center text-iron-100 text-xs font-bold p-1 border border-iron-700 rounded outline-none focus:border-iron-accent" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Ejerc. (seg)</span>
                  <input type="number" value={restPerExercise} onChange={(e)=>setRestPerExercise(Number(e.target.value))} className="w-14 bg-iron-800 text-center text-iron-100 text-xs font-bold p-1 border border-iron-700 rounded outline-none focus:border-iron-accent" />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};