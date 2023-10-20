import React from 'react';

const MensagemPerfilAlterado = () => {
  return (
    <div className="br-message danger" role="alert">
      <div className="icon"><i className="fas fa-check-circle fa-lg" aria-hidden="true"></i></div>
      <div className="content">
        <span className="message-title">Sucesso.</span>
        <span className="message-body"> O perfil foi alterado com sucesso!</span>
      </div>
      <div className="close">
        <button className="br-button circle small" type="button" aria-label="Fechar">
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};

export default MensagemPerfilAlterado;
