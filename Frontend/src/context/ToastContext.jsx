import { createContext, useEffect, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toastOpen, setToastOpen] = useState();
  const [toastMessage, setToastMessage] = useState();

  function handleOpenToast(message) {
    setToastOpen(false);
    setTimeout(() => {
      setToastMessage(message);
      setToastOpen(true);
    }, 500);
  }

  function handleCloseToast(reason) {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  }

  return (
    <ToastContext.Provider
      value={{
        toastOpen,
        toastMessage,
        handleOpenToast,
        handleCloseToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export default ToastContext;
