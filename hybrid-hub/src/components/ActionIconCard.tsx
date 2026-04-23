import React from 'react';

interface ActionIconCardProps {
  icon: React.ReactNode;
  label: string;
}

export const ActionIconCard: React.FC<ActionIconCardProps> = ({ icon, label }) => {
  return (
    <div className="flex flex-col items-center gap-3 group cursor-pointer">
      <div className="bg-blue-100 text-blue-600 p-6 rounded-full text-3xl group-hover:bg-blue-200 transition-colors">
        {icon}
      </div>
      <span className="text-lg font-semibold text-gray-700">{label}</span>
    </div>
  );
};