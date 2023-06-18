import '../components-escolasCadastradas/ModalExibirInformacoes.css';
import React, { useState } from "react";
import fetchInfoEscola from "../../service/listarInfoEscola";
import { Dropdown, notification } from 'antd';
import ModalBody from './ModalBody';
import { useSelectedValue } from '../../context/Situation';
import fetchchangeSituation from '../../service/changeSituation';
import ModalExcluirEscolas from "../components-escolasCadastradas/ModalExcluirEscolas";

    
const ModalExibirInformacoes = () => {
  const [isModalExibirInformacoesOpen, setIsModalExibirInformacoesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const [isModalExcluirEscolasOpen, setIsModalExcluirEscolasOpen] = useState(false);


  const openModal = async () => {
    setIsModalExibirInformacoesOpen(true);

    try {
      await fetchInfoEscola({ id: 10 });
    } catch (error) {
      console.log("error");
    }

  };

  const closeModal = () => {
    setIsModalExibirInformacoesOpen(false);
  };

  const { selectedValue, setSelectedValue } = useSelectedValue();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", selectedValue);
    const salvarsituacaoData = {
      idEscola: 10,
      idSituacao:selectedValue
    };

     try {
      await fetchchangeSituation(salvarsituacaoData);
    } catch (error) {
      api.error({ message: `Erro ao salvar situação` });
    } 
  };

  const openDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <>
    {contextHolder}
      <button className="br-button primary ml-2" onClick={openModal}>Visualizar informações</button>
      {isModalExibirInformacoesOpen && (
        <div className="modal">
          <div className="modal-content">
            <div>
              <div className="container">
                <div className="div br-modal large">
                  <div className="br-modal-header">CED 02 de taguatinga
                  </div>
                  <ModalBody/>
          <ModalExcluirEscolas open={isModalExcluirEscolasOpen} id={26} close={() => setIsModalExcluirEscolasOpen(false)} /> 
                  <div className="br-modal-footer ">
                    <button className=" br-button cancel-button content-left "  type="button" onClick={() => setIsModalExcluirEscolasOpen(true)}>Excluir escola
                    </button>
                    <div className='content-right'>
                      <button className="br-button secondary" type="button" onClick={closeModal}>Cancelar
                      </button>
                      <button className="br-button primary ml-2 " type="button" onClick={onFinish}>Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      )}
      

    </>
  );
};

export default ModalExibirInformacoes;
