import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  User, Calendar, Dumbbell, Activity, 
  Scale, Ruler, Info, Camera, TrendingUp 
} from "lucide-react";

export const Profile = () => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para datos físicos (puedes conectarlos a tu DB más adelante)
  const [weight, setWeight] = useState(90);
  const [height, setHeight] = useState(180);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("Hombre");

  // Estado para contadores reales
  const [stats, setStats] = useState({ gym: 0, cardio: 0, total: 0 });

  // 1. Cálculo de IMC automático
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: "Bajo peso", color: "text-blue-400" };
    if (val < 25) return { label: "Saludable", color: "text-iron-accent" };
    if (val < 30) return { label: "Sobrepeso", color: "text-orange-400" };
    return { label: "Obesidad", color: "text-red-500" };
  };

  // 2. Cargar estadísticas reales desde el backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/sessions?userEmail=${currentUser?.email}`);
        const sessions = await response.json();
        
        const gymCount = sessions.filter((s: any) => s.type === "Gym").length;
        const cardioCount = sessions.filter((s: any) => s.type === "Cardio").length;
        
        setStats({
          gym: gymCount,
          cardio: cardioCount,
          total: gymCount + cardioCount
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };
    if (currentUser?.email) fetchStats();
  }, [currentUser]);

  const handleImageClick = () => fileInputRef.current?.click();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in duration-700">
      
      {/* SECCIÓN 1: CABECERA (BOCETO TOP) */}
      <div className="bg-iron-800 rounded-3xl border-4 border-iron-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar con subida de imagen */}
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <div className="w-32 h-32 rounded-full border-4 border-iron-accent overflow-hidden bg-iron-900 flex items-center justify-center">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={60} className="text-iron-accent" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-iron-100 uppercase tracking-tighter">
              {currentUser?.displayName || "PEPE PEREZ"}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
              <Calendar size={14} className="text-iron-accent" />
              <span>Se unió el {new Date(currentUser?.metadata.creationTime || "").toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Contador Total */}
        <div className="bg-iron-900 border-2 border-iron-700 p-4 rounded-2xl flex flex-col items-center min-w-[120px]">
          <Calendar size={20} className="text-iron-accent mb-1" />
          <span className="text-3xl font-black text-iron-100">{stats.total}</span>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sesiones</span>
        </div>
      </div>

      {/* SECCIÓN 2: DATOS FÍSICOS Y RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda: Datos e IMC */}
        <div className="bg-iron-800 rounded-3xl border-2 border-iron-700 p-6 shadow-xl">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between border-b border-iron-700 pb-2">
              <span className="text-iron-accent font-black uppercase text-xs">Nombre:</span>
              <span className="text-iron-100 font-bold">{currentUser?.displayName?.split(' ')[0] || "Pepe"}</span>
            </div>
            <div className="flex justify-between border-b border-iron-700 pb-2">
              <span className="text-iron-accent font-black uppercase text-xs">Edad:</span>
              <span className="text-iron-100 font-bold">{age} años</span>
            </div>
            <div className="flex justify-between border-b border-iron-700 pb-2">
              <span className="text-iron-accent font-black uppercase text-xs">Género:</span>
              <span className="text-iron-100 font-bold">{gender}</span>
            </div>
            <div className="flex justify-between border-b border-iron-700 pb-2">
              <span className="text-iron-accent font-black uppercase text-xs">Altura:</span>
              <span className="text-iron-100 font-bold">{height} cm</span>
            </div>
            <div className="flex justify-between border-b border-iron-700 pb-2">
              <span className="text-iron-accent font-black uppercase text-xs">Peso:</span>
              <span className="text-iron-100 font-bold">{weight} kg</span>
            </div>
          </div>

          {/* Tarjeta IMC (Boceto Central) */}
          <div className="bg-iron-900 rounded-2xl p-6 border-2 border-iron-700 text-center">
            <h4 className="text-iron-accent font-black uppercase text-sm tracking-widest mb-2">IMC</h4>
            <div className="text-4xl font-black text-iron-100 mb-1">{bmi}</div>
            <div className={`text-sm font-black uppercase tracking-widest ${getBmiStatus(Number(bmi)).color}`}>
              "{getBmiStatus(Number(bmi)).label}"
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen Actividad */}
        <div className="bg-iron-800 rounded-3xl border-2 border-iron-700 p-6 shadow-xl flex flex-col">
          <h4 className="text-center text-iron-accent font-black uppercase text-xs tracking-[0.2em] mb-8">
            Resumen de Actividad
          </h4>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-iron-900 rounded-2xl p-4 border-2 border-iron-700 text-center">
              <Dumbbell size={24} className="mx-auto text-iron-accent mb-2" />
              <div className="text-3xl font-black text-iron-100">{stats.gym}</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sesiones Gym</div>
            </div>
            <div className="bg-iron-900 rounded-2xl p-4 border-2 border-iron-700 text-center">
              <Activity size={24} className="mx-auto text-iron-accent mb-2" />
              <div className="text-3xl font-black text-iron-100">{stats.cardio}</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sesiones Cardio</div>
            </div>
          </div>

          <div className="mt-auto text-center italic text-gray-500 text-sm py-4 border-t border-iron-700">
            Tu última sesión fue hace "X días"
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: FUTURAS FUNCIONES (BOCETO BOTTOM) */}
      <div className="bg-iron-900/50 rounded-3xl border-2 border-dashed border-iron-700 p-8 text-center opacity-60">
        <h4 className="text-gray-400 font-black uppercase text-sm tracking-[0.3em] mb-4">
          Futuras Funciones "PRO"
        </h4>
        <div className="flex flex-wrap justify-center gap-6 text-xs font-black uppercase tracking-widest text-gray-600">
          <span className="flex items-center gap-2"><TrendingUp size={14}/> Entrenador Personal</span>
          <span className="flex items-center gap-2"><Dumbbell size={14}/> Rutina Hecha</span>
          <span className="flex items-center gap-2"><Scale size={14}/> Nutrición</span>
        </div>
      </div>

    </div>
  );
};