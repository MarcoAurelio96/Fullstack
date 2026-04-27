import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export const NavItem = ({ icon, label, isActive }: NavItemProps) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'text-iron-accent bg-iron-900/50' // Activo: Amarillo y fondo ligeramente oscurecido
          : 'text-gray-400 hover:text-iron-100 hover:bg-iron-900/30' // Inactivo: Gris, hover a blanco
      }`}
    >
      <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
        {icon}
      </div>
      <span className="text-xs font-semibold mt-1">{label}</span>
    </div>
  );
};