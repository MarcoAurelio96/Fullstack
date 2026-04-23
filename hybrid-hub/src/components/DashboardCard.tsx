// src/components/DashboardCard.tsx
import React from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {/* Aquí renderizamos lo que le pasemos por dentro */}
      <div className="w-full flex justify-center gap-8">
        {children}
      </div>
    </div>
  );
};