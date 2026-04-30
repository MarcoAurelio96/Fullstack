import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-iron-900/90 backdrop-blur-sm">
      
      <div className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto bg-iron-800 border-t-2 sm:border-2 border-iron-700 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        <div className="w-12 h-1.5 bg-iron-700 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 text-gray-400 hover:text-iron-accent transition-colors z-10 bg-iron-900 p-1.5 rounded-full shadow-md"
        >
          <X size={20} strokeWidth={3} />
        </button>
        
        <div className="p-2 sm:p-4 pt-6 sm:pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};