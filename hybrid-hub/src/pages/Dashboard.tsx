import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

import { Home, Dumbbell, Activity, Calendar, Plus, User } from "lucide-react";

import { DashboardCard } from "../components/DashboardCard";
import { NavItem } from "../components/NavItem";
import { ActionIconCard } from "../components/ActionIconCard";

import { Modal } from "../components/modal";
import { GymExerciseForm } from "../components/GymExerciseForm";
import { CardioSessionForm } from "../components/CardioSessionForm";

import { GymSessionSelector } from "../components/GymSessionSelector";
import { ActiveGymSession } from "../components/ActiveGymSession";
import { CardioSessionSelector } from "../components/CardioSessionSelector";
import { ActiveCardioSession } from "../components/ActiveCardioSession";

// Importamos el historial
import { SessionHistory } from "../components/SessionHistory";

type ModalType = "Gym" | "Cardio" | "ChooseSessionType" | "SelectGym" | "SelectCardio" | null;

export const Dashboard = () => {
  const { currentUser } = useAuth();
  
  // Estado para la navegación por pestañas
  const [currentTab, setCurrentTab] = useState<"Inicio" | "Historial">("Inicio");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  
  // Guardamos los datos de la sesión y también el "tipo" de sesión activa
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

  const finishSession = async (finalData: any[]) => {
    try {
      const response = await fetch("http://localhost:5000/api/sessions", {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <Activity size={32} strokeWidth={2.5} />
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Iron Pace</h1>
          </div>
          
          {/* NAVEGACIÓN POR PESTAÑAS */}
          <div className="flex gap-4">
            <div onClick={() => setCurrentTab("Inicio")} className="cursor-pointer">
              <NavItem icon={<Home size={24} />} label="Inicio" isActive={currentTab === "Inicio"} />
            </div>
            
            <NavItem icon={<Dumbbell size={24} />} label="Gym" />
            <NavItem icon={<Activity size={24} />} label="Cardio" />
            
            <div onClick={() => setCurrentTab("Historial")} className="cursor-pointer">
              <NavItem icon={<Calendar size={24} />} label="Historial" isActive={currentTab === "Historial"} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm font-semibold transition-colors">Cerrar Sesión</button>
            <div className="bg-gray-100 text-gray-600 p-3 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
              <User size={24} />
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-grow p-12 relative">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          
          {/* LÓGICA DE PESTAÑAS: Si es Inicio, mostramos el dashboard. Si es Historial, mostramos la lista */}
          {currentTab === "Inicio" ? (
            <>
              <DashboardCard title="Añade nuevos Ejercicios" subtitle="Elige el tipo de ejercicio">
                <div onClick={() => openModal("Gym")}><ActionIconCard icon={<Dumbbell size={40} strokeWidth={1.5} />} label="Gym" /></div>
                <div onClick={() => openModal("Cardio")}><ActionIconCard icon={<Activity size={40} strokeWidth={1.5} />} label="Cardio" /></div>
              </DashboardCard>

              {/* RENDERIZADO CONDICIONAL DE LA SESIÓN ACTIVA */}
              {activeSession && activeSessionType === "Gym" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <p className="text-blue-600 font-bold ml-4 mb-4 flex items-center gap-2">
                     <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
                     Tu sesión activa
                   </p>
                   <ActiveGymSession 
                     exercises={activeSession} 
                     onFinish={finishSession} 
                     onAddExercise={() => openModal("SelectGym")} 
                   />
                </div>
              )}

              {activeSession && activeSessionType === "Cardio" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <p className="text-blue-600 font-bold ml-4 mb-4 flex items-center gap-2">
                     <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
                     Tu sesión activa
                   </p>
                   <ActiveCardioSession exercises={activeSession} onFinish={finishSession} />
                </div>
              )}

              <p className="text-gray-500 font-medium ml-4 -mb-8">¿Empezamos la sesión?</p>

              <DashboardCard title="Nueva sesión de Entrenamiento" subtitle="Selecciona los ejercicios de hoy">
                <button 
                  onClick={() => openModal("ChooseSessionType")}
                  className="bg-blue-50 text-blue-600 p-8 rounded-full border-2 border-blue-100 shadow-sm hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                >
                  <Plus size={48} strokeWidth={2} />
                </button>
              </DashboardCard>
            </>
          ) : (
            /* AQUÍ MOSTRAMOS EL HISTORIAL CUANDO currentTab === "Historial" */
            <SessionHistory />
          )}
          
        </div>
      </main>

      {/* MODALES */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        
        {modalType === "Gym" && <GymExerciseForm />}
        {modalType === "Cardio" && <CardioSessionForm />}
        
        {modalType === "ChooseSessionType" && (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Qué toca hoy?</h3>
            <p className="text-gray-500 mb-8">Elige el tipo de sesión que quieres comenzar</p>
            <div className="flex justify-center gap-8">
              <div onClick={() => setModalType("SelectGym")}>
                <ActionIconCard icon={<Dumbbell size={48} strokeWidth={1.5} />} label="Gym" />
              </div>
              <div onClick={() => setModalType("SelectCardio")}>
                <ActionIconCard icon={<Activity size={48} strokeWidth={1.5} />} label="Cardio" />
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