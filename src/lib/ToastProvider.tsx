"use client";

import { Id, toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast--success {
    background-color: #00f476 !important;
    color: white !important;
    border-left: 5px solid #00f476;
  }

  .Toastify__toast--error {
    background-color: #f44336 !important;
    color: white !important;
    border-left: 5px solid #d32f2f;
  }

  .Toastify__toast--info {
    background-color: #2196f3 !important;
    color: white !important;
    border-left: 5px solid #1976d2;
  }

  .Toastify__toast--warning {
    background-color: #ff9800 !important;
    color: white !important;
    border-left: 5px solid #f57c00;
  }
`;

const activeToasts = new Map<string, Id>(); // Map para rastrear mensagens e IDs

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning",
  options = {}
) => {
  // Verifica se a mensagem já está ativa
  if (!activeToasts.has(message)) {
    const toastId = toast[type](message, {
      ...options,
      onClose: () => {
        activeToasts.delete(message); 
      },
    });

    activeToasts.set(message, toastId);
  } else {
    // Caso necessário, atualiza o toast existente 
    const existingToastId = activeToasts.get(message);
    if (existingToastId) {
      toast.update(existingToastId, {
        ...options,
      });
    }
  }
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StyledToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        icon={false}
        draggable
        theme="colored"
      />
    </>
  );
}
