import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Dumbbell, ArrowRight, CheckCircle2 } from "lucide-react";

export const Register = () => {
  const { signup } = useAuth(); 
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("Hombre");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }
    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    try {
      setError("");
      setIsLoading(true);
      await signup(email, password, name);
      
      setStep(2);
    } catch (err: any) {
      setError("Error al crear la cuenta. Puede que el correo ya exista.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !height || !weight) {
      return setError("Por favor, rellena todos los campos físicos");
    }

    try {
      setError("");
      setIsLoading(true);

      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: name,
          age: Number(age),
          gender: gender,
          height: Number(height),
          weight: Number(weight),
        }),
      });

      navigate("/dashboard");
    } catch (err) {
      setError("Error al guardar tus datos físicos.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-iron-900 flex items-center justify-center p-4">
      <div className="bg-iron-800 w-full max-w-md rounded-3xl border-2 border-iron-700 p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* CABECERA IRON PACE */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dumbbell size={32} className="text-iron-accent" />
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              Iron <span className="text-iron-accent">Pace</span>
            </h1>
          </div>
          <h2 className="text-white font-bold uppercase tracking-widest text-sm">
            {step === 1 ? "Únete a Ironpace" : "Completa tu Perfil"}
          </h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">
            {step === 1 ? "Registra tus entrenamientos hoy" : "Calcularemos tu IMC y métricas"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl text-center mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        {/* ================= PASO 1: DATOS BÁSICOS ================= */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5 animate-in slide-in-from-left">
            <div>
              <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Nombre Completo</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Laura García"
                className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Correo Electrónico</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Contraseña</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Repetir Contraseña</label>
              <input 
                type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Vuelve a escribir la contraseña"
                className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent transition-colors"
              />
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-iron-accent text-iron-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-[1.02] transition-transform mt-8"
            >
              {isLoading ? "Cargando..." : "Comenzar Mi Viaje"}
              {!isLoading && <ArrowRight size={20} strokeWidth={3} />}
            </button>
          </form>
        )}

        {/* ================= PASO 2: DATOS FÍSICOS ================= */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5 animate-in slide-in-from-right">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Edad</label>
                <input 
                  type="number" required value={age} onChange={(e) => setAge(Number(e.target.value))}
                  placeholder="Años" min="10" max="100"
                  className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent text-center"
                />
              </div>
              
              <div>
                <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Género</label>
                <select 
                  value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent text-center appearance-none"
                >
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Altura (CM)</label>
                <input 
                  type="number" required value={height} onChange={(e) => setHeight(Number(e.target.value))}
                  placeholder="Ej: 180" min="100" max="250"
                  className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent text-center"
                />
              </div>
              
              <div>
                <label className="block text-iron-accent font-black text-[10px] uppercase tracking-widest mb-1">Peso (KG)</label>
                <input 
                  type="number" required value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="Ej: 80" min="30" max="300"
                  className="w-full bg-iron-900 border-2 border-iron-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-iron-accent text-center"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-iron-accent text-iron-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-[1.02] transition-transform mt-8"
            >
              {isLoading ? "Guardando..." : "Guardar y Entrar"}
              {!isLoading && <CheckCircle2 size={20} strokeWidth={3} />}
            </button>
          </form>
        )}

        {/* FOOTER (Solo se muestra en el paso 1) */}
        {step === 1 && (
          <div className="mt-8 text-center">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">¿Ya tienes una cuenta? </span>
            <Link to="/login" className="text-iron-accent text-xs font-black uppercase tracking-widest hover:underline">
              Inicia Sesión Aquí
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};