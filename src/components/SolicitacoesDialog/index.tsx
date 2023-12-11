import React, { ReactNode, useState, useEffect } from 'react';
import "../../styles/App.css";
import "../../pages/Ranque/";
import Modal from "../../components/Modal/index";
import { fetchEscolaRanque } from '../../service/ranqueApi';
import { EscolaRanqueDetalhes } from '../../models/ranque';
import ReactLoading from "react-loading";
import { formataCustoLogistico } from '../../utils/utils';
import "./index.css";
import { SolicitacoesData } from '../../models/solicitacoes';

interface ModalProps {
    onClose: () => void;
    onCreateAcao: () => void;
    escolaSelecionada?: SolicitacoesData
}

interface LabelProps {
    children: ReactNode,
    className?: string,
}

function Label({ children, className }: LabelProps) {
    return (<label style={{ fontSize: '14px', fontWeight: 'normal' }} className={'mb-2 ' + className}>
        {children}
    </label>)
}

const SolicitacoesDialog: React.FC<ModalProps> = ({ escolaSelecionada, onClose, onCreateAcao }) => {    
    if (!escolaSelecionada) {
        return (
            <Modal className="modal-title" closeModal={() => onClose()}>
                <h4 className="text-center mt-2">Carregando Escola...</h4>
                <div className="d-flex justify-content-center m-4">
                    <ReactLoading type="spinningBubbles" color="#000000" />
                </div>
                <span></span>
            </Modal>
        );
    }

    return (
        <Modal className="default escola-ranque-modal" closeModal={() => onClose()}>
            <div className="d-flex flex-column">
                <h4 className="text-center mt-1">Detalhes da Solicitação</h4>
                <div className='d-flex flex-column '>
                    <Label>Nome Escola: {escolaSelecionada?.escola?.nomeEscola || escolaSelecionada?.nome} </Label>
                    <Label><strong>Dados</strong></Label>
                    <div className='row mb-2'>
                        <div className='col-12 col-md-6'>
                            <Label>Código: {escolaSelecionada?.escola?.codigoEscola}</Label>
                        </div>
                        <div className='col-12 col-md-6'>
                            <Label>Telefone escola: {escolaSelecionada?.escola?.telefone.replace(/^(\d{2})(\d{4})(\d{4})/gm, "($1) $2-$3")}</Label>
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-12 col-md-6'>
                            <Label>Alunos: {escolaSelecionada?.escola?.numeroTotalDeAlunos || escolaSelecionada?.quantidadeAlunos}</Label>
                        </div>
                        <div className='col-12 col-md-6'>
                            <Label>Professores: {escolaSelecionada?.escola?.numeroTotalDeDocentes}</Label>
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-12 col-md-6'>
                            <Label>Porte: {escolaSelecionada?.escola?.porte}</Label>
                        </div>
                        <div className='col-12 col-md-6'>
                            <Label>Situação: {escolaSelecionada?.escola?.situacao}</Label>
                        </div>
                    </div>
                    <Label>Rede: {escolaSelecionada?.escola?.rede}</Label>
                    <Label>Etapas de Ensino: {escolaSelecionada?.escola?.etapaEnsino ? Object.values(escolaSelecionada?.escola?.etapaEnsino).join(', ') : ''}</Label>
                    <hr />
                    <div>
                        <div className='d-flex flex-column'>
                            <Label><strong>Endereço</strong></Label>
                            <Label>Endereco: {escolaSelecionada?.escola?.endereco}</Label>
                            <div className='row'>
                                <div className='col-12 col-md-6'>
                                    <Label>Estado: {escolaSelecionada?.escola?.siglaUf || escolaSelecionada?.uf}</Label>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <Label>Município: {escolaSelecionada?.escola?.nomeMunicipio || escolaSelecionada?.municipio.nome}</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='d-flex flex-column '>
                        <Label><strong>Solicitações</strong></Label>
                        <div className='d-flex flex-column'>
                            <Label>Nome do Solicitante: {escolaSelecionada?.nomeSolicitante}</Label>
                            <Label>Vinculo com a Escola: Vínculo</Label>
                            <Label>e-mail: {escolaSelecionada?.email}</Label>
                            <Label>Telefone: {escolaSelecionada?.telefone.replace(/^(\d{2})(\d{4})(\d{4})/gm, "($1) $2-$3")}</Label>
                            <Label>Observações: {escolaSelecionada?.observacoes}</Label>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="d-flex w-100 justify-content-end mb-2">
                <button data-testid="botaoFechar" className="br-button secondary mr-3" type="button" onClick={() => onClose()}>
                    Fechar
                </button>
                <button data-testid="botaoCriar" className="br-button primary mr-3" type="button" onClick={() => { onCreateAcao() }} disabled>
                    Criar Ação
                </button>
            </div>

        </Modal>
    );
};

export default SolicitacoesDialog;
