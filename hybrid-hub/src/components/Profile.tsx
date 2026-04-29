import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Calendar, Camera, Loader2, Dumbbell, Activity, Settings, XCircle } from "lucide-react";

export const Profile = () => {
  const { currentUser } = useAuth();
  
  const [totalSessions, setTotalSessions] = useState(0);
  const [gymSessions, setGymSessions] = useState(0);
  const [cardioSessions, setCardioSessions] = useState(0);

  const [weight, setWeight] = useState(90); // kg
  const [height, setHeight] = useState(180); // cm
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("Hombre");
  const [isEditing, setIsEditing] = useState(false);

  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: "Bajo peso", color: "text-blue-400" };
    if (val < 25) return { label: "Saludable", color: "text-iron-accent" };
    if (val < 30) return { label: "Sobrepeso", color: "text-orange-400" };
    return { label: "Obesidad", color: "text-red-500" };
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido (jpg, png).');
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setTimeout(() => setIsUploading(false), 1500); // Simulación de carga
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/sessions?userEmail=${currentUser?.email}`);
        const sessions = await response.json();
        
        const gymCount = sessions.filter((s: any) => s.type === "Gym").length;
        const cardioCount = sessions.filter((s: any) => s.type === "Cardio").length;
        
        setGymSessions(gymCount);
        setCardioSessions(cardioCount);
        setTotalSessions(sessions.length);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };
    if (currentUser?.email) fetchStats();
  }, [currentUser]);

  const joinDate = currentUser?.metadata.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString() 
    : "Desconocida";

  const imageToDisplay = previewImage || currentUser?.photoURL;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in duration-700">
      
      {/* --- BLOQUE 1: CABECERA --- */}
      <div className="bg-iron-800 rounded-3xl border-4 border-iron-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-32 h-32 rounded-full border-4 border-iron-accent overflow-hidden bg-iron-900 flex items-center justify-center relative">
              {imageToDisplay ? (
                <img src={imageToDisplay} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={60} className="text-iron-accent" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full">
                  <Loader2 size={32} className="text-iron-accent animate-spin" />
                </div>
              )}
            </div>
            {!isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            )}
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

      {/* --- BLOQUE 2: DATOS FÍSICOS Y DESGLOSE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda: Datos e IMC Editables */}
        <div className="bg-iron-800 rounded-3xl border-2 border-iron-700 p-6 shadow-xl relative">
          
          {/* BOTÓN DE AJUSTES */}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 text-gray-500 hover:text-iron-accent transition-colors"
          >
            {isEditing ? <XCircle size={20} /> : <Settings size={20} />}
          </button>

          <h3 className="text-iron-accent font-black uppercase text-xs tracking-widest mb-6">Datos del Atleta</h3>

          <div className="space-y-4 mb-8">
            {/* EDAD */}
            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Edad:</span>
              {isEditing ? (
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 w-20 text-right outline-none focus:border-iron-accent transition-colors"
                />
              ) : (
                <span className="text-iron-100 font-bold">{age} años</span>
              )}
            </div>

            {/* GÉNERO */}
            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Género:</span>
              {isEditing ? (
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 outline-none focus:border-iron-accent transition-colors"
                >
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Otro">Otro</option>
                </select>
              ) : (
                <span className="text-iron-100 font-bold">{gender}</span>
              )}
            </div>

            {/* ALTURA */}
            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Altura (cm):</span>
              {isEditing ? (
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 w-20 text-right outline-none focus:border-iron-accent transition-colors"
                />
              ) : (
                <span className="text-iron-100 font-bold">{height} cm</span>
              )}
            </div>

            {/* PESO */}
            <div className="flex justify-between items-center border-b border-iron-700 pb-2">
              <span className="text-gray-500 font-black uppercase text-[10px]">Peso (kg):</span>
              {isEditing ? (
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="bg-iron-900 text-iron-100 font-bold px-2 py-1 rounded border border-iron-700 w-20 text-right outline-none focus:border-iron-accent transition-colors"
                />
              ) : (
                <span className="text-iron-100 font-bold">{weight} kg</span>
              )}
            </div>

            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="w-full mt-4 bg-iron-accent text-iron-900 font-black py-3 rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg"
              >
                Guardar Cambios
              </button>
            )}
          </div>

          {/* Tarjeta IMC */}
          <div className="bg-iron-900 rounded-2xl p-6 border-2 border-iron-700 text-center">
            <h4 className="text-iron-accent font-black uppercase text-xs tracking-widest mb-2">Tu IMC Actual</h4>
            <div className="text-4xl font-black text-iron-100 mb-1">{bmi}</div>
            <div className={`text-sm font-black uppercase tracking-widest ${getBmiStatus(Number(bmi)).color}`}>
              "{getBmiStatus(Number(bmi)).label}"
            </div>
          </div>
        </div>

        {/* Columna Derecha: Desglose Gym vs Cardio */}
        <div className="bg-iron-800 rounded-3xl border-2 border-iron-700 p-6 shadow-xl flex flex-col">
          <h4 className="text-center text-iron-accent font-black uppercase text-xs tracking-[0.2em] mb-8">
            Desglose de Entrenamientos
          </h4>

          <div className="grid grid-cols-2 gap-4 flex-grow">
            <div className="bg-iron-900 rounded-2xl p-4 border-2 border-iron-700 flex flex-col items-center justify-center text-center transition-colors hover:border-iron-accent/30">
              <Dumbbell size={32} className="text-iron-accent mb-3" />
              <div className="text-4xl font-black text-iron-100">{gymSessions}</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Sesiones Gym</div>
            </div>
            
            <div className="bg-iron-900 rounded-2xl p-4 border-2 border-iron-700 flex flex-col items-center justify-center text-center transition-colors hover:border-iron-accent/30">
              <Activity size={32} className="text-iron-accent mb-3" />
              <div className="text-4xl font-black text-iron-100">{cardioSessions}</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Sesiones Cardio</div>
            </div>
          </div>
        </div>
        
      </div>

      {/* Input oculto para subir la imagen */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
    </div>
  );
};