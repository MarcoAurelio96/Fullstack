import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Únete a IronPace</h2>
          <p className="text-gray-500 mt-2">Empieza a registrar tus entrenamientos hoy</p>
        </div>
        
        {/* Caja de error visual */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Campo: Nombre */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Ej: Laura García"
              required
            />
          </div>

          {/* Campo: Email */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Campo: Contraseña */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          {/* Campo: Repetir Contraseña */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Repetir Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Vuelve a escribir la contraseña"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02] disabled:bg-blue-300 disabled:scale-100 mt-2 shadow-md"
          >
            {loading ? "Creando cuenta..." : "Comenzar mi viaje"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};