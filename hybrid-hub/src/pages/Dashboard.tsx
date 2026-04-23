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

export const Dashboard = () => {
  const { currentUser } = useAuth();
  
  // --- ESTADOS DEL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"Gym" | "Cardio" | null>(null);

  // Funciones para abrir y cerrar
  const openModal = (type: "Gym" | "Cardio") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalType(null), 200); 
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
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <nav className="bg-white p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-2 text-blue-600">
            <Activity size={32} strokeWidth={2.5} />
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Iron Pace</h1>
          </div>
          
          <div className="flex gap-4">
            <NavItem icon={<Home size={24} />} label="Inicio" isActive />
            <NavItem icon={<Dumbbell size={24} />} label="Gym" />
            <NavItem icon={<Activity size={24} />} label="Cardio" />
            <NavItem icon={<Calendar size={24} />} label="Historial" />
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 text-sm font-semibold transition-colors"
            >
              Cerrar Sesión
            </button>
            <div className="bg-gray-100 text-gray-600 p-3 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
              <User size={24} />
            </div>
          </div>
        </div>
      </nav>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-grow p-12 relative">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          
          <DashboardCard 
            title="Añade nuevos Ejercicios"
            subtitle="Elige el tipo de ejercicio"
          >
            {/* 3. Añadimos eventos onClick a las tarjetas */}
            <div onClick={() => openModal("Gym")}>
              <ActionIconCard icon={<Dumbbell size={40} strokeWidth={1.5} />} label="Gym" />
            </div>
            <div onClick={() => openModal("Cardio")}>
              <ActionIconCard icon={<Activity size={40} strokeWidth={1.5} />} label="Cardio" />
            </div>
          </DashboardCard>

          <p className="text-gray-500 font-medium ml-4 -mb-8">¿Empezamos la sesión?</p>

          <DashboardCard 
            title="Nueva sesión de Entrenamiento"
            subtitle="Selecciona los ejercicios de hoy"
          >
            <button className="bg-blue-50 text-blue-600 p-8 rounded-full border-2 border-blue-100 shadow-sm hover:bg-blue-100 hover:scale-105 transition-all duration-200">
              <Plus size={48} strokeWidth={2} />
            </button>
          </DashboardCard>
          
        </div>
      </main>

      {/* --- EL MODAL FLOTANTE --- */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalType === "Gym" && <GymExerciseForm />}
        {modalType === "Cardio" && <CardioSessionForm />}
      </Modal>

    </div>
  );
};