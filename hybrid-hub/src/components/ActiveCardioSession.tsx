import { useState, useEffect } from "react";
import { CheckCircle2, Timer, Route, XCircle, Play, Pause, Square } from "lucide-react";
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
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return h === "00" ? `${m}:${s}` : `${h}:${m}:${s}`;
  };

  const stopAndSaveTime = () => {
    setIsRunning(false);
    const durationInMinutes = Math.round(timeElapsed / 60);
    
    if (sessionExercises.length > 0 && durationInMinutes > 0) {
      updateField(sessionExercises[0]._id, 'duration', durationInMinutes.toString());
    }
    
    setTimeElapsed(0);
  };

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
    <div className="w-full bg-iron-800 rounded-2xl border-4 border-iron-900 shadow-2xl overflow-hidden animate-in slide-in-from-top duration-500 flex flex-col">
      <div className="bg-iron-900 p-5 flex justify-between items-center border-b-2 border-iron-800 shrink-0">
        <div>
          <h3 className="font-black text-iron-100 uppercase tracking-tighter text-lg">Sesión Cardio en curso</h3>
          <p className="text-iron-accent text-xs font-bold uppercase tracking-widest">En ruta • GPS Activo</p>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow flex flex-col items-center">
        
        {/* --- CRONÓMETRO --- */}
        <div className="w-full flex flex-col items-center pb-6 border-b-2 border-iron-900">
          <div className="bg-iron-900 border-4 border-iron-700 w-48 h-48 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center shadow-inner relative overflow-hidden mb-6">
            {isRunning && <div className="absolute inset-0 border-4 border-iron-accent rounded-full animate-[spin_4s_linear_infinite] opacity-30"></div>}
            <span className={`text-5xl sm:text-6xl font-black tabular-nums transition-colors z-10 ${isRunning ? 'text-iron-accent' : 'text-iron-100'}`}>
              {formatTime(timeElapsed)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 z-10 text-center px-4">
              {isRunning ? "Grabando tiempo..." : timeElapsed === 0 ? "Pulsa Play para iniciar" : "Pausado"}
            </span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg ${isRunning ? 'bg-iron-800 text-iron-accent border-2 border-iron-700' : 'bg-iron-accent text-iron-900'}`}
            >
              {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button 
              onClick={stopAndSaveTime}
              title="Detener y volcar tiempo"
              className="w-16 h-16 rounded-full flex items-center justify-center bg-iron-800 border-2 border-iron-700 text-red-500 transition-transform hover:scale-110 hover:border-red-500 hover:bg-red-500/10 shadow-lg"
            >
              <Square size={24} />
            </button>
          </div>
        </div>
        {/* --------------------------------- */}

        <div className="w-full space-y-4">
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

              <div className="flex items-center gap-4 self-center md:self-auto w-full md:w-auto justify-center">
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
                  <div className="bg-iron-800 border-2 border-iron-700 rounded-xl px-4 py-2 flex items-center gap-2 focus-within:border-iron-accent transition-colors">
                     <Timer size={16} className={ex.duration ? "text-iron-accent" : "text-gray-500"} />
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
        </div>

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