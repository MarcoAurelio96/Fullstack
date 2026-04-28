import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Dumbbell, UserPlus } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (name.trim() === "") {
      setError("Por favor, introduce tu nombre.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Compruébalo, por favor.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email ya tiene una cuenta. ¡Prueba a iniciar sesión!");
      } else {
        setError("Error al conectar con el servidor. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-iron-900 p-4 font-sans selection:bg-iron-accent selection:text-iron-900">
      <div className="bg-iron-800 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border-2 border-iron-700 my-8">
        
        {/* LOGO Y CABECERA */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 text-iron-accent mb-6">
            <Dumbbell size={40} strokeWidth={1.5} />
            <h1 className="text-4xl font-black text-iron-100 tracking-tight uppercase">
              Iron <span className="text-iron-accent">Pace</span>
            </h1>
          </div>
          <h2 className="text-xl font-black text-iron-100 uppercase tracking-tight">Únete a IronPace</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Registra tus entrenamientos hoy</p>
        </div>
        
        {/* CAJA DE ERROR */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
            <p className="text-xs text-red-400 font-black uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Campo: Nombre */}
          <div>
            <label className="block text-iron-accent text-xs font-black uppercase mb-2 ml-1">Nombre completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-iron-900 border-2 border-iron-700 rounded-xl text-iron-100 focus:outline-none focus:border-iron-accent transition-colors font-bold"
              placeholder="Ej: Laura García"
              required
            />
          </div>

          {/* Campo: Email */}
          <div>
            <label className="block text-iron-accent text-xs font-black uppercase mb-2 ml-1">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-iron-900 border-2 border-iron-700 rounded-xl text-iron-100 focus:outline-none focus:border-iron-accent transition-colors font-bold"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Campo: Contraseña */}
          <div>
            <label className="block text-iron-accent text-xs font-black uppercase mb-2 ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-iron-900 border-2 border-iron-700 rounded-xl text-iron-100 focus:outline-none focus:border-iron-accent transition-colors font-bold"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          {/* Campo: Repetir Contraseña */}
          <div>
            <label className="block text-iron-accent text-xs font-black uppercase mb-2 ml-1">Repetir Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-iron-900 border-2 border-iron-700 rounded-xl text-iron-100 focus:outline-none focus:border-iron-accent transition-colors font-bold"
              placeholder="Vuelve a escribir la contraseña"
              required
            />
          </div>

          {/* BOTÓN DE REGISTRO */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-iron-accent text-iron-900 font-black py-4 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale mt-4 shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {loading ? (
              "Creando cuenta..."
            ) : (
              <>
                <UserPlus size={20} strokeWidth={3} />
                Comenzar mi viaje
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider mt-8">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-iron-accent hover:text-iron-100 transition-colors">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};