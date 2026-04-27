// src/components/DashboardCard.tsx
import React from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const DashboardCard = ({ title, subtitle, children }: DashboardCardProps) => {
  return (
    <div className="w-full bg-iron-800 rounded-none sm:rounded-2xl p-8 transition-all">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-iron-100">{title}</h2>
        {subtitle && <p className="text-gray-400 mt-1 font-medium">{subtitle}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {children}
      </div>
    </div>
  );
};