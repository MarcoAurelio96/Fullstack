import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-2xl bg-gray-50 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Botón flotante de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
        >
          <X size={24} />
        </button>

        {/* Aquí dentro inyectaremos el formulario (Gym o Cardio) */}
        <div className="p-2">
          {children}
        </div>
      </div>
    </div>
  );
};