import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Calendar, Camera } from "lucide-react";

export const Profile = () => {
  const { currentUser } = useAuth();
  
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    const fetchTotalSessions = async () => {
      try {
        const response = await fetch(`/api/sessions?userEmail=${currentUser?.email}`);
        const sessions = await response.json();
        
        setTotalSessions(sessions.length);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    if (currentUser?.email) {
      fetchTotalSessions();
    }
  }, [currentUser]);

  const joinDate = currentUser?.metadata.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString() 
    : "Desconocida";

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in duration-700">
      
      {/* --- BLOQUE 1: CABECERA --- */}
      <div className="bg-iron-800 rounded-3xl border-4 border-iron-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-iron-accent overflow-hidden bg-iron-900 flex items-center justify-center">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={60} className="text-iron-accent" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-iron-100 uppercase tracking-tighter">
              {currentUser?.displayName || "Atleta Iron"}
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
      {/* --- FIN BLOQUE 1 --- */}

    </div>
  );
};