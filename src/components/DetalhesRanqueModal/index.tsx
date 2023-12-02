import React, { ReactNode, useState, useEffect } from 'react';
import "../../styles/App.css";
import "../../pages/Ranque/";
import Modal from "../../components/Modal/index";
import { fetchRanques } from '../../service/ranqueApi';
import { EscolaRanqueDetalhes, RanqueData, ListaPaginada } from '../../models/ranque';
import ReactLoading from "react-loading";
import "./index.css";
import { notification } from 'antd';
import { ranqueData } from '../../tests/stub/ranqueModelos';

interface ModalProps {
    onClose: () => void;
    onEditDescription: () => void;
    ranque: RanqueData;
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

const ModalDetalhesRanque: React.FC<ModalProps> = ({ ranque, onEditDescription, onClose}) => {
    const [notificationApi, contextHolder] = notification.useNotification();

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const padZeros = (n: number) => n.toString().padStart(2, '0');
    return `${padZeros(date.getDate())}/${padZeros(date.getMonth())}/${date.getFullYear()} ${padZeros(date.getHours())}:${padZeros(date.getMinutes())}`
}

    return (
        <div className='escola-ranque-modal'>
            <Modal className="default escola-ranque-modal" closeModal={() => onClose()}>
                {contextHolder}
                <div className="d-flex flex-column">
                    <h4 className="text-center mt-1">Detalhes do Ranque</h4>
                    <br/>
                    <Label><strong>Data e hora do processamento:</strong></Label>
                    <Label>{formatDate(ranque.data)}</Label> 
                    <br/>
                    <Label><strong>Número de escolas:</strong> {ranque.numEscolas}</Label>
                    <br/>
                    <Label><strong>Fatores do processamento:</strong></Label>
                    <div className='d-flex flex-column'>
                        {ranque.fatores.map(f => <Label className='ml-4'>Fator {f.nome}, Peso {f.peso}, Valor {f.valor}</Label>)}
                    </div>
                    <br/>
                    <Label><strong>Dercrição do Ranque:</strong></Label>
                    <Label>{ranque.descricao}</Label>
                    <div className='d-flex flex-column '>
                    </div>
                </div>
                <div className="d-flex w-100 justify-content-end mb-2">
                    <button className="br-button secondary mr-3" type="button" onClick={() => onClose()}>
                        Fechar
                    </button>
                    <button className="br-button primary mr-3" type="button" onClick={() => { onEditDescription() }} >
                        Editar Descrição
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ModalDetalhesRanque;