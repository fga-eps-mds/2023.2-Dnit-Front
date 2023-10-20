import React from 'react';

const MensagemErroResultadoNaoEncontrado = () => {
  return (
    <div className="br-message danger" role="alert">
        <div className="icon"><i className="fas fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
        <div className="content"><span className="message-title">Erro.</span><span className="message-body"> Desculpe, nenhum resultado encontrado. Veja se houve algum erro de digitação.</span></div>
        <div className="close">
            <button className="br-button circle small" type="button" aria-label="Fechar">
                <i className="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
        </div>
  );
};

export default MensagemErroResultadoNaoEncontrado;