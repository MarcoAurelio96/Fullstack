import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

import { Home, Dumbbell, Activity, Calendar, Plus, User } from "lucide-react";

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

      console.log("¡Sesión guardada en la base de datos con éxito! 🎉");
      
    } catch (error) {
      console.error("Hubo un problema al guardar el historial:", error);
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

  return (
    <div className="min-h-screen bg-iron-900 flex flex-col font-sans selection:bg-iron-accent selection:text-iron-900">
      
      <nav className="bg-iron-800 p-4 border-b-4 border-iron-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-2 text-iron-accent">
            <Dumbbell size={32} strokeWidth={1} />
            <h1 className="text-2xl font-extrabold text-iron-100 tracking-tight uppercase">Iron Pace</h1>
          </div>
          
          <div className="flex gap-4">
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

          <div className="flex items-center gap-6">
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm font-bold transition-colors">
              Cerrar Sesión
            </button>
            <div onClick={() => setCurrentTab("Perfil")} className="bg-iron-900 text-iron-accent p-3 rounded-xl border-2 border-transparent hover:border-iron-accent transition-colors cursor-pointer">
              <User size={24} />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-12 relative">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          
          
          {currentTab === "Inicio" && (
            <>
              <DashboardCard 
                title="AÑADE NUEVOS EJERCICIOS" 
                subtitle="Elige el tipo de ejercicio"
              >
                <div 
                  onClick={() => openModal("Gym")} 
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="bg-iron-accent text-iron-900 p-6 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200">
                    <Dumbbell size={36} strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-bold uppercase text-iron-accent group-hover:scale-105 transition-transform">Gym</span>
                </div>

                <div 
                  onClick={() => openModal("Cardio")} 
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="bg-iron-accent text-iron-900 p-6 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200">
                    <Activity size={36} strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-bold uppercase text-iron-accent group-hover:scale-105 transition-transform">Cardio</span>
                </div>
              </DashboardCard>

              {activeSession && activeSessionType === "Gym" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <p className="text-iron-accent font-bold ml-4 mb-4 flex items-center gap-2">
                     <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iron-accent opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-iron-accent"></span></span>
                     Tu sesión activa
                   </p>
                   <ActiveGymSession 
                     exercises={activeSession} 
                     onFinish={finishSession} 
                     onAddExercise={() => openModal("SelectGym")} 
                     onCancel={cancelSession}
                   />
                </div>
              )}

              {activeSession && activeSessionType === "Cardio" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <p className="text-iron-accent font-bold ml-4 mb-4 flex items-center gap-2">
                     <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iron-accent opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-iron-accent"></span></span>
                     Tu sesión activa
                   </p>
                   <ActiveCardioSession 
                     exercises={activeSession} 
                     onFinish={finishSession} 
                     onCancel={cancelSession}
                   />
                </div>
              )}

              <p className="text-iron-100 font-medium ml-4 -mb-8">¿Empezamos la sesión?</p>

              <DashboardCard 
                title="NUEVA SESIÓN DE ENTRENAMIENTO" 
                subtitle="Selecciona los ejercicios de hoy"
              >
                <button 
                  onClick={() => openModal("ChooseSessionType")}
                  className="bg-iron-accent text-iron-900 p-6 rounded-2xl hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  <Plus size={36} strokeWidth={2.5} />
                </button>
              </DashboardCard>
            </>
          )}

          {currentTab === "Historial" && <SessionHistory />}
          
          {currentTab === "Gym" && <GymLibrary />}
          
          {currentTab === "Cardio" && <CardioLibrary />}

          {currentTab === "Perfil" && <Profile />}
          
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalType === "Gym" && <GymExerciseForm />}
        {modalType === "Cardio" && <CardioSessionForm />}
        
        {modalType === "ChooseSessionType" && (
          <div className="p-8 text-center bg-iron-800 rounded-none sm:rounded-2xl">
            <h3 className="text-2xl font-bold text-iron-100 mb-2 uppercase">¿Qué toca hoy?</h3>
            <p className="text-iron-100 mb-8 font-medium">Elige el tipo de sesión que quieres comenzar</p>
            <div className="flex justify-center gap-8">
              <div 
                onClick={() => setModalType("SelectGym")} 
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="bg-iron-accent text-iron-900 p-6 rounded-full hover:scale-105 transition-transform">
                  <Dumbbell size={32} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold uppercase text-iron-accent">Gym</span>
              </div>
              <div 
                onClick={() => setModalType("SelectCardio")} 
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="bg-iron-accent text-iron-900 p-6 rounded-full hover:scale-105 transition-transform">
                  <Activity size={32} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold uppercase text-iron-accent">Cardio</span>
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