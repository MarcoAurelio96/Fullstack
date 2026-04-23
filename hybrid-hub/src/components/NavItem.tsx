import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false }) => {
  return (
    <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors cursor-pointer 
      ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
      <div className={`text-2xl ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
};