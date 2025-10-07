import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-hover w-full ${sizes[size]} max-h-[90vh] overflow-y-auto transition-all duration-200`}>
          {title && (
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h2 className="text-h2 text-text">{title}</h2>
              <button
                onClick={onClose}
                className="text-muted hover:text-text transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
