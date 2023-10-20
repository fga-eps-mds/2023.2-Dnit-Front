import React, { useState } from 'react';

interface MensagemProps {
  popUpType: string;
  iconClass: string;
  title: string;
  body: string;
  onClose?: () => void;
}

function MensagemPerfilAlterado(props: MensagemProps) {
  const { popUpType, iconClass, title, body, onClose } = props;
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return isVisible ? (
    <div className={`br-message ${popUpType}`} role="alert">
      <div className="icon"><i className={`fas ${iconClass}`} aria-hidden="true"></i></div>
      <div className="content">
        <span className="message-title">{title}</span>
        <span className="message-body">{" "+body}</span>
      </div>
      <div className="close">
        <button className="br-button circle small" type="button" aria-label="Fechar" onClick={handleClose}>
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  ) : null;
}

export default MensagemPerfilAlterado;
