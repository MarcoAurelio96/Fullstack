import { useAuth } from "../context/AuthContext";
import { User, Mail, ShieldCheck, Activity, Award, Dumbbell } from "lucide-react";

export const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* CABECERA DEL PERFIL */}
      <div className="bg-iron-800 p-8 rounded-3xl border-4 border-iron-900 shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="bg-iron-900 p-6 rounded-full border-4 border-iron-accent text-iron-accent shadow-[0_0_20px_rgba(255,211,105,0.2)]">
          <User size={64} strokeWidth={2.5} />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-iron-100 uppercase tracking-tight">
            {currentUser?.displayName || "Atleta Iron"}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-400 font-bold tracking-widest text-xs uppercase">
            <ShieldCheck size={16} className="text-iron-accent" />
            <span>Cuenta Verificada</span>
          </div>
        </div>
      </div>

      {/* DATOS DE LA CUENTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-iron-800 p-6 rounded-3xl border-2 border-iron-700 shadow-xl">
          <h3 className="text-iron-accent text-xs font-black uppercase mb-6 flex items-center gap-2 tracking-widest">
            <Mail size={16} />
            Credenciales de Acceso
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Email Registrado</label>
              <div className="bg-iron-900 px-4 py-3 rounded-xl border-2 border-iron-800 text-iron-100 font-bold">
                {currentUser?.email || "No disponible"}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Contraseña</label>
              <div className="bg-iron-900 px-4 py-3 rounded-xl border-2 border-iron-800 text-gray-500 font-bold">
                ••••••••••••
              </div>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS RÁPIDAS (Visuales) */}
        <div className="bg-iron-800 p-6 rounded-3xl border-2 border-iron-700 shadow-xl">
          <h3 className="text-iron-accent text-xs font-black uppercase mb-6 flex items-center gap-2 tracking-widest">
            <Activity size={16} />
            Resumen de Actividad
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-iron-900 p-4 rounded-xl border-2 border-iron-800 flex flex-col items-center justify-center text-center">
              <Dumbbell size={24} className="text-iron-accent mb-2" />
              <span className="text-2xl font-black text-iron-100">PRO</span>
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Nivel Actual</span>
            </div>
            
            <div className="bg-iron-900 p-4 rounded-xl border-2 border-iron-800 flex flex-col items-center justify-center text-center">
              <Award size={24} className="text-iron-accent mb-2" />
              <span className="text-2xl font-black text-iron-100">Activo</span>
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Estado</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};