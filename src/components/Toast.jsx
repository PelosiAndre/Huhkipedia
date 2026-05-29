function Toast({ toast }) {
  if (!toast.show) return null;
  
  return (
    <div className={`toast-notification toast-${toast.type}`}>
      {toast.message}
    </div>
  );
}

export default Toast;