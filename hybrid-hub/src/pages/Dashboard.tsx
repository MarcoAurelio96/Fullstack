import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

import { Home, Dumbbell, Activity, Calendar, Plus, User, Loader2, CheckCircle2 } from "lucide-react"; 

import { DashboardCard } from "../components/DashboardCard";
import { NavItem } from "../components/NavItem";

import { Modal } from "../components/modal";
import { GymExerciseForm } from "../components/GymExerciseForm";
import { CardioSessionForm } from "../components/CardioSessionForm";

import { GymSessionSelector } from "../components/GymSessionSelector";
import { ActiveGymSession } from "../components/ActiveGymSession";
import { CardioSessionSelector } from "../components/CardioSessionSelector";
import { ActiveCardioSession } from "../components/ActiveCardioSession";

import { SessionHistory } from "../components/SessionHistory";
import { GymLibrary } from "../components/GymLibrary";
import { CardioLibrary } from "../components/CardioLibrary";
import { Profile } from "../components/Profile";

type ModalType = "Gym" | "Cardio" | "ChooseSessionType" | "SelectGym" | "SelectCardio" | null;

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<"Inicio" | "Gym" | "Cardio" | "Historial" | "Perfil">("Inicio");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  
  const [activeSession, setActiveSession] = useState<any>(null);
  const [activeSessionType, setActiveSessionType] = useState<"Gym" | "Cardio" | null>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);
  
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("Hombre");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");

  // --- LÓGICA DE AVATAR AUTOMÁTICO PARA EL NAVBAR ---
  const userName = currentUser?.displayName || "Atleta Iron";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=eab308&color=18181b&bold=true&size=150`;
  const imageToDisplay = currentUser?.photoURL || defaultAvatar;

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!currentUser?.email) return;

      try {
        const response = await fetch(`/api/users?email=${currentUser.email}`);
        if (response.status === 404) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error);
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkUserStatus();
  }, [currentUser]);

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !height || !weight) return alert("Rellena todos los campos");

    setIsSavingOnboarding(true);
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser?.email,
          name: currentUser?.displayName,
          age: Number(age),
          gender,
          height: Number(height),
          weight: Number(weight),
        }),
      });
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error al guardar onboarding:", error);
      alert("Error al guardar los datos.");
    } finally {
      setIsSavingOnboarding(false);
    }
  };

  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalType(null), 200); 
  };

  const startSession = (exercises: any[], type: "Gym" | "Cardio") => {
    if (activeSession && activeSessionType === type) {
      const newExercises = exercises.filter(ex => !activeSession.some((a: any) => a._id === ex._id));
      setActiveSession([...activeSession, ...newExercises]);
    } else {
      setActiveSession(exercises);
      setActiveSessionType(type);
    }
    closeModal();
  };

  const cancelSession = () => {
    const isConfirmed = window.confirm("¿Seguro que quieres cancelar la sesión actual? Perderás todo el progreso de hoy.");
    if (isConfirmed) {
      setActiveSession(null);
      setActiveSessionType(null);
    }
  };

  const finishSession = async (finalData: any[]) => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email,
          sessionType: activeSessionType,
          exercises: finalData
        }),
      });
      if (!response.ok) throw new Error("Error al guardar la sesión");
      console.log("¡Sesión guardada con éxito! 🎉");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setActiveSession(null);
        setActiveSessionType(null);
      }, 2000);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  if (isCheckingUser) {
    return (
      <div className="min-h-screen bg-iron-900 flex items-center justify-center">
        <Loader2 className="text-iron-accent animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-iron-900 flex flex-col font-sans selection:bg-iron-accent selection:text-iron-900">
      
      {/* ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-iron-900/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-iron-800 w-full max-w-md rounded-3xl border-4 border-iron-900 p-6 sm:p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="bg-iron-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-iron-accent">
                <User size={40} className="text-iron-accent" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-iron-100 uppercase tracking-tighter">Bienvenido, {currentUser?.displayName?.split(' ')[0]}</h2>
              <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase mt-2 tracking-widest">Completa tu perfil de atleta</p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-iron-accent font-black text-[10px] uppercase tracking-widest ml-1">Edad</label>
                  <input type="number" required value={age} onChange={(e) => setAge(Number(e.target.value))} placeholder="Años" className="w-full bg-iron-900 border-2 border-iron-700 rounded-2xl p-3 sm:p-4 text-white font-bold outline-none focus:border-iron-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-iron-accent font-black text-[10px] uppercase tracking-widest ml-1">Género</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-iron-900 border-2 border-iron-700 rounded-2xl p-3 sm:p-4 text-white font-bold outline-none focus:border-iron-accent transition-colors appearance-none">
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-iron-accent font-black text-[10px] uppercase tracking-widest ml-1">Altura (cm)</label>
                  <input type="number" required value={height} onChange={(e) => setHeight(Number(e.target.value))} placeholder="Ej: 175" className="w-full bg-iron-900 border-2 border-iron-700 rounded-2xl p-3 sm:p-4 text-white font-bold outline-none focus:border-iron-accent transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-iron-accent font-black text-[10px] uppercase tracking-widest ml-1">Peso (kg)</label>
                  <input type="number" required value={weight} onChange={(e) => setWeight(Number(e.target.value))} placeholder="Ej: 80" className="w-full bg-iron-900 border-2 border-iron-700 rounded-2xl p-3 sm:p-4 text-white font-bold outline-none focus:border-iron-accent transition-colors" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSavingOnboarding}
                className="w-full bg-iron-accent text-iron-900 font-black py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-iron-accent/20 disabled:opacity-50 text-sm sm:text-base"
              >
                {isSavingOnboarding ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} strokeWidth={3} />}
                {isSavingOnboarding ? "Sincronizando..." : "Finalizar Perfil"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NAVBAR PRINCIPAL (Sticky en Desktop, Header limpio en Móvil) */}
      <nav className="bg-iron-800 p-4 border-b-4 border-iron-900 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Brand/Logo */}
          <div className="flex items-center gap-2 text-iron-accent">
            <Dumbbell size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
            {/* Ocultamos el texto en pantallas muy pequeñas si hace falta, aunque aquí entra bien */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-iron-100 tracking-tight uppercase">Iron Pace</h1>
          </div>
          
          {/* TABS DESKTOP (Se ocultan en móvil 'md:hidden') */}
          <div className="hidden md:flex gap-4">
            <div onClick={() => setCurrentTab("Inicio")} className="cursor-pointer">
              <NavItem icon={<Home size={24} />} label="Inicio" isActive={currentTab === "Inicio"} />
            </div>
            <div onClick={() => setCurrentTab("Gym")} className="cursor-pointer">
              <NavItem icon={<Dumbbell size={24} />} label="Gym" isActive={currentTab === "Gym"} />
            </div>
            <div onClick={() => setCurrentTab("Cardio")} className="cursor-pointer">
              <NavItem icon={<Activity size={24} />} label="Cardio" isActive={currentTab === "Cardio"} />
            </div>
            <div onClick={() => setCurrentTab("Historial")} className="cursor-pointer">
              <NavItem icon={<Calendar size={24} />} label="Historial" isActive={currentTab === "Historial"} />
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-xs sm:text-sm font-bold transition-colors">
              Cerrar Sesión
            </button>
            <img 
              onClick={() => setCurrentTab("Perfil")} 
              src={imageToDisplay} 
              alt="Avatar Perfil" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white hover:scale-105 transition-transform cursor-pointer object-cover shadow-md"
            />
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      {/* pb-28 y md:pb-12 aseguran espacio para el menú inferior en móvil */}
      <main className="flex-grow p-4 pb-28 md:p-12 md:pb-12 relative overflow-x-hidden">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">
          
          {currentTab === "Inicio" && (
            <>
              {!activeSession ? (
                <>
                  <DashboardCard title="AÑADE NUEVOS EJERCICIOS" subtitle="Elige el tipo de ejercicio">
                    <div className="flex flex-row justify-around w-full gap-4">
                      <div onClick={() => openModal("Gym")} className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                        <div className="bg-iron-accent text-iron-900 p-4 sm:p-6 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-iron-accent/20">
                          <Dumbbell size={32} strokeWidth={2.5} className="sm:w-9 sm:h-9" />
                        </div>
                        <span className="text-sm sm:text-xl font-bold uppercase text-iron-accent group-hover:scale-105 transition-transform mt-2">Gym</span>
                      </div>
                      
                      <div onClick={() => openModal("Cardio")} className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                        <div className="bg-iron-accent text-iron-900 p-4 sm:p-6 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-iron-accent/20">
                          <Activity size={32} strokeWidth={2.5} className="sm:w-9 sm:h-9" />
                        </div>
                        <span className="text-sm sm:text-xl font-bold uppercase text-iron-accent group-hover:scale-105 transition-transform mt-2">Cardio</span>
                      </div>
                    </div>
                  </DashboardCard>

                  <p className="text-iron-100 font-medium ml-2 sm:ml-4 -mb-4 sm:-mb-8 text-sm sm:text-base">¿Empezamos la sesión?</p>

                  <DashboardCard title="NUEVA SESIÓN DE ENTRENAMIENTO" subtitle="Selecciona los ejercicios de hoy">
                    <button onClick={() => openModal("ChooseSessionType")} className="w-full sm:w-auto bg-iron-accent text-iron-900 p-4 sm:p-6 rounded-2xl hover:scale-105 active:scale-95 transition-transform duration-200 flex justify-center shadow-lg shadow-iron-accent/20">
                      <Plus size={32} strokeWidth={2.5} className="sm:w-9 sm:h-9" />
                    </button>
                  </DashboardCard>
                </>
              ) : (
                <>
                  {activeSessionType === "Gym" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                       <p className="text-iron-accent font-bold ml-2 sm:ml-4 mb-4 flex items-center gap-2 text-sm sm:text-base">
                         <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iron-accent opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-iron-accent"></span></span>
                         Tu sesión activa
                       </p>
                       <ActiveGymSession exercises={activeSession} onFinish={finishSession} onAddExercise={() => openModal("SelectGym")} onCancel={cancelSession} />
                    </div>
                  )}

                  {activeSessionType === "Cardio" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                       <p className="text-iron-accent font-bold ml-2 sm:ml-4 mb-4 flex items-center gap-2 text-sm sm:text-base">
                         <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iron-accent opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-iron-accent"></span></span>
                         Tu sesión activa
                       </p>
                       <ActiveCardioSession exercises={activeSession} onFinish={finishSession} onCancel={cancelSession} />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {currentTab === "Historial" && <SessionHistory />}
          {currentTab === "Gym" && <GymLibrary />}
          {currentTab === "Cardio" && <CardioLibrary />}
          {currentTab === "Perfil" && <Profile />}
          
        </div>
      </main>

      {/* NAVBAR INFERIOR MÓVIL (Bottom Bar - Solo visible en sm y md) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-iron-900 border-t-2 border-iron-800 z-40 pb-safe pt-2 px-2 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <div className="flex justify-around items-center">
          <div onClick={() => setCurrentTab("Inicio")} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${currentTab === "Inicio" ? "text-iron-accent" : "text-gray-500"}`}>
            <Home size={24} className={currentTab === "Inicio" ? "animate-bounce" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
          </div>
          
          <div onClick={() => setCurrentTab("Gym")} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${currentTab === "Gym" ? "text-iron-accent" : "text-gray-500"}`}>
            <Dumbbell size={24} className={currentTab === "Gym" ? "animate-bounce" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Gym</span>
          </div>
          
          <div onClick={() => setCurrentTab("Cardio")} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${currentTab === "Cardio" ? "text-iron-accent" : "text-gray-500"}`}>
            <Activity size={24} className={currentTab === "Cardio" ? "animate-bounce" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Cardio</span>
          </div>
          
          <div onClick={() => setCurrentTab("Historial")} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${currentTab === "Historial" ? "text-iron-accent" : "text-gray-500"}`}>
            <Calendar size={24} className={currentTab === "Historial" ? "animate-bounce" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Historial</span>
          </div>
        </div>
      </nav>

      {/* MODAL GLOBAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalType === "Gym" && <GymExerciseForm />}
        {modalType === "Cardio" && <CardioSessionForm />}
        {modalType === "ChooseSessionType" && (
          <div className="p-6 pb-12 sm:p-8 text-center bg-iron-800 rounded-none sm:rounded-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-iron-100 mb-2 uppercase">¿Qué toca hoy?</h3>
            <p className="text-iron-100 mb-8 font-medium text-sm sm:text-base">Elige el tipo de sesión que quieres comenzar</p>
            <div className="flex justify-center gap-6 sm:gap-8">
              <div onClick={() => setModalType("SelectGym")} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="bg-iron-accent text-iron-900 p-5 sm:p-6 rounded-full hover:scale-105 transition-transform shadow-lg shadow-iron-accent/20">
                  <Dumbbell size={32} strokeWidth={2.5} />
                </div>
                <span className="text-sm sm:text-lg font-bold uppercase text-iron-accent mt-2">Gym</span>
              </div>
              <div onClick={() => setModalType("SelectCardio")} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="bg-iron-accent text-iron-900 p-5 sm:p-6 rounded-full hover:scale-105 transition-transform shadow-lg shadow-iron-accent/20">
                  <Activity size={32} strokeWidth={2.5} />
                </div>
                <span className="text-sm sm:text-lg font-bold uppercase text-iron-accent mt-2">Cardio</span>
              </div>
            </div>
          </div>
        )}
        {modalType === "SelectGym" && <GymSessionSelector onSessionStart={(ex) => startSession(ex, "Gym")} />}
        {modalType === "SelectCardio" && <CardioSessionSelector onSessionStart={(ex) => startSession(ex, "Cardio")} />}
      </Modal>

    </div>
  );
};