import React, { ReactNode, useState, useEffect } from 'react';
import "../../styles/App.css";
import "../../pages/Ranque/";
import Modal from "../../components/Modal/index";
import Table, { CustomTableRow } from '../../components/Table';
import ModalDetalhesRanque from '../../components/DetalhesRanqueModal';
import { fetchRanques } from '../../service/ranqueApi';
import { RanqueData } from '../../models/ranque';
import ReactLoading from "react-loading";
import "./index.css";
import { notification } from 'antd';
import { urlAPIEscolas } from '../../consts/service';
import { formatDate } from '../../utils/utils';

interface ModalProps {
    onClose: () => void;
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

const ModalExportarRanque: React.FC<ModalProps> = ({ onClose }) => {
    const [notificationApi, contextHolder] = notification.useNotification();
    const [ranqueAtual, setRanqueAtual] = useState<RanqueData | null>();
    const colunas = ['Data e Hora', 'Número de escolas', 'Descrição'];
    const [listaRanques, setListaRanques] = useState<RanqueData[] | null>(null);
    const [pagina, setPagina] = useState(1);
    const [tamanhoPagina, setTamanhoPagina] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchRanques(pagina, tamanhoPagina)
            .then((ranque) => {
                setListaRanques(ranque.items);
                setTotalPages(ranque.totalPaginas);
                setTotalItems(ranque.total);
            })
    }, [pagina, tamanhoPagina]);

    if (!listaRanques) {
        return (
            <Modal className="modal-title" closeModal={() => onClose()}>
                <h4 className="text-center mt-2">Carregando Tabela...</h4>
                <div className="d-flex justify-content-center m-4">
                    <ReactLoading type="spinningBubbles" color="#000000" />
                </div>
                <span></span>
            </Modal>
        );
    }

    const onDownload = (ranque: RanqueData) => {
        window.open(`${urlAPIEscolas}/ranque/${ranque.id}/exportar`, "_blank");
        notificationApi.success({message: "A exportação dos dados foi realizada com sucesso"});
    }

    return (
        <div className='exportar-ranque-modal'>
            <Modal className="default exportar-ranque-modal" width={1000} closeModal={() => onClose()}>
                {contextHolder}
                {ranqueAtual != null && <ModalDetalhesRanque onClose={() => { setRanqueAtual(null) }} onEditDescription={() => { }} ranque={ranqueAtual} />}
                <div className="d-flex flex-column">
                    <h4 className="text-center mt-1">Histórico de Ranques</h4>
                </div>

                <div style={{ maxHeight: '800px', overflowY: 'visible' }}>
                    <Table
                        columsTitle={colunas}
                        title=''
                        initialItemsPerPage={5}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onNextPage={() => {
                            if (pagina === totalPages) return;
                            setPagina(p => p + 1)
                        }}
                        onPreviousPage={() => {
                            if (pagina === 1) return;
                            setPagina(p => p - 1)
                        }}
                        onPageResize={(newTamanhoPagina) => {
                            setTamanhoPagina(newTamanhoPagina);
                        }}
                        onPageSelect={(newPagina) => {
                            setPagina(newPagina);
                        }}>
                        {
                            listaRanques.map((e, index) =>
                                <CustomTableRow
                                    key={e.id}
                                    id={index}
                                    data={{
                                        '0': `${formatDate(e.data)}`,
                                        '1': `${e.numEscolas}`,
                                        '2': e.descricao ? `${e.descricao.substring(0, 30)}${e.descricao.length > 30 ? '...' : ''}` : '',
                                    }}
                                    hideTrashIcon={true}
                                    hideEditIcon={true}
                                    hideDownloadIcon={false}
                                    onDetailRow={_ => setRanqueAtual(e)}
                                    onDownload={_ => onDownload(e)}
                                />
                            )
                        }
                    </Table>
                    <div className="d-flex w-100 justify-content-end mb-2">
                        <button className="br-button secondary mr-3" type="button" onClick={() => onClose()}>
                            Fechar
                        </button>
                    </div>
                </div>

                <br />

            </Modal>
        </div>
    );
};

export default ModalExportarRanque;