import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-iron-900/90 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-iron-800 border-2 border-iron-700 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-iron-accent transition-colors z-10 bg-iron-900 p-1.5 rounded-full"
        >
          <X size={20} strokeWidth={3} />
        </button>
        
        <div className="p-2">
          {children}
        </div>
      </div>
    </div>
  );
};