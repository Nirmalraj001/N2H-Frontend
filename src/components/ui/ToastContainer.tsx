import { useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideToast } from '../../store/slices/uiSlice';

export const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(state => state.ui.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const icons = {
    success: <Info className="w-5 h-5" />,
    error: <Info className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] animate-slide-in ${colors[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="flex-1 font-medium">{toast.message}</p>
        <button onClick={() => dispatch(hideToast())} className="hover:opacity-70">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
