import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle2 size={18} />,
    error:   <XCircle size={18} />,
    info:    <Info size={18} />,
  };
  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={15} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
