import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, Loader2, Dumbbell, Activity, Settings, XCircle, Save } from "lucide-react";

export const Profile = () => {
  const { currentUser } = useAuth();
  
  const [totalSessions, setTotalSessions] = useState(0);
  const [gymSessions, setGymSessions] = useState(0);
  const [cardioSessions, setCardioSessions] = useState(0);
  const [daysSinceLast, setDaysSinceLast] = useState<number | null>(null);

  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("Hombre");
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- LÓGICA DE IMC ---
  const bmi = height > 0 ? (weight / ((height / 100) ** 2)).toFixed(1) : "0.0";
  const getBmiStatus = (val: number) => {
    if (val === 0) return { label: "Faltan datos", color: "text-gray-500" };
    if (val < 18.5) return { label: "Bajo peso", color: "text-blue-400" };
    if (val < 25) return { label: "Saludable", color: "text-iron-accent" };
    if (val < 30) return { label: "Sobrepeso", color: "text-orange-400" };
    return { label: "Obesidad", color: "text-red-500" };
  };

  const handleSaveChanges = async () => {
    if (!currentUser?.email) return;
    
    setIsSaving(true);
    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          age,
          gender,
          height,
          weight
        })
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.email) return;

      try {
        const userRes = await fetch(`/api/users?email=${currentUser.email}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData) {
            setAge(userData.age || 0);
            setGender(userData.gender || "Hombre");
            setHeight(userData.height || 0);
            setWeight(userData.weight || 0);
          }
        }

        const sessionsRes = await fetch(`/api/sessions?userEmail=${currentUser.email}`);
        const sessions = await sessionsRes.json();

        if (Array.isArray(sessions)) {
          const gymCount = sessions.filter((s: any) => s.sessionType === "Gym").length;
          const cardioCount = sessions.filter((s: any) => s.sessionType === "Cardio").length;
          
          setGymSessions(gymCount);
          setCardioSessions(cardioCount);
          setTotalSessions(sessions.length);

          if (sessions.length > 0) {
            const mostRecent = sessions.reduce((latest: any, current: any) => {
              const currentDate = new Date(current.createdAt || current.date);
              const latestDate = new Date(latest.createdAt || latest.date);
              return currentDate > latestDate ? current : latest;
            });
            const lastDate = new Date(mostRecent.createdAt || mostRecent.date);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
            setDaysSinceLast(diffDays);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, [currentUser]);

  const joinDate = currentUser?.metadata.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString() 
    : "Desconocida";

  // --- LÓGICA DE AVATAR AUTOMÁTICO ---
  const userName = currentUser?.displayName || "Atleta Iron";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=eab308&color=18181b&bold=true&size=150`;
  const imageToDisplay = currentUser?.photoURL || defaultAvatar;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in duration-700">
      
      {/* CABECERA */}
      <div className="bg-iron-800 rounded-3xl border-4 border-iron-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-iron-accent overflow-hidden bg-iron-900 flex items-center justify-center shadow-lg">
              <img src={imageToDisplay} alt="Perfil del Atleta" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-iron-100 uppercase tracking-tighter">
              {userName}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
              <Calendar size={14} className="text-iron-accent" />
              <span>Se unió el {joinDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-iron-900 border-2 border-iron-700 p-4 rounded-2xl flex flex-col items-center min-w-[120px]">
          <Calendar size={20} className="text-iron-accent mb-1" />
          <span className="text-3xl font-black text-iron-100">{totalSessions}</span>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sesiones Totales</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BLOQUE DATOS FÍSICOS */}
        <div className="bg-iron-800 rounded-3xl border-2 border-iron-700 p-6 shadow-xl relative">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="absolute top-4 right-4 text-gray-500 hover:text-iron-accent transition-colors"
          >
            {isEditing ? <XCircle size={20} /> : <Settings size={20} />}
          </button>
          
          <h3 className="text-iron-accent font-black uppercase text-xs tracking-widest mb-6">Datos del Atleta</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Edad:</span>
              {isEditing ? (
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 w-20 text-right outline-none focus:border-iron-accent" />
              ) : (
                <span className="text-iron-100 font-bold">{age > 0 ? `${age} años` : "-"}</span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Género:</span>
              {isEditing ? (
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 outline-none focus:border-iron-accent">
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Otro">Otro</option>
                </select>
              ) : (
                <span className="text-iron-100 font-bold">{gender}</span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Altura (cm):</span>
              {isEditing ? (
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 w-20 text-right outline-none focus:border-iron-accent" />
              ) : (
                <span className="text-iron-100 font-bold">{height > 0 ? `${height} cm` : "-"}</span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Peso (kg):</span>
              {isEditing ? (
                <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 w-20 text-right outline-none focus:border-iron-accent" />
              ) : (
                <span className="text-iron-100 font-bold">{weight > 0 ? `${weight} kg` : "-"}</span>
              )}
            </div>

            {isEditing && (
              <button 
                onClick={handleSaveChanges} 
                disabled={isSaving}
                className="w-full mt-4 bg-iron-accent text-iron-900 font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            )}
          </div>

          <div className="bg-iron-900 rounded-2xl p-6 border-2 border-iron-700 text-center">
            <h4 className="text-iron-accent font-black uppercase text-xs tracking-widest mb-2">Tu IMC Actual</h4>
            <div className="text-4xl font-black text-iron-100 mb-1">{bmi}</div>
            <div className={`text-sm font-black uppercase tracking-widest ${getBmiStatus(Number(bmi)).color}`}>"{getBmiStatus(Number(bmi)).label}"</div>
          </div>
        </div>

        {/* BLOQUE SESIONES */}
        <div className="bg-iron-800 rounded-3xl border-2 border-iron-700 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-center text-iron-accent font-black uppercase text-xs tracking-[0.2em] mb-8">Desglose de Entrenamientos</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-iron-900 rounded-2xl p-4 border-2 border-iron-700 flex flex-col items-center justify-center text-center">
                <Dumbbell size={32} className="text-iron-accent mb-3" />
                <div className="text-4xl font-black text-iron-100">{gymSessions}</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Sesiones Gym</div>
              </div>
              <div className="bg-iron-900 rounded-2xl p-4 border-2 border-iron-700 flex flex-col items-center justify-center text-center">
                <Activity size={32} className="text-iron-accent mb-3" />
                <div className="text-4xl font-black text-iron-100">{cardioSessions}</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Sesiones Cardio</div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-iron-700 text-center">
            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              {daysSinceLast === null ? "Sin sesiones registradas aún" : daysSinceLast === 0 ? "Última sesión: Hoy 🔥" : `Última sesión hace ${daysSinceLast} días`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};