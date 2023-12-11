import { ReactNode, useEffect, useRef } from "react";
import "./styles.css";

interface ModalProps {
  className: string;
  children: ReactNode;
  width?: number; 
  closeModal: (opened: boolean) => void;
}

export default function Modal({ className = 'default', children, width = 500, closeModal }: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeModal(false);
    }
  };

  const modalStyle: React.CSSProperties={width:`${width}px`}

  return (
    <div  className={"overlay " + className} data-testid="overlay" onClick={handleOverlayClick} onKeyDown={() => { }}>
      <div className="br-modal medium" style={modalStyle}>
        <div className="br-modal-body d-flex flex-column w-100">
          {children}
        </div>
      </div>
    </div>
  );
}