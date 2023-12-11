import { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ButtonComponent } from "../../components/Button";
import "./styles.css";
import { EtapasDeEnsinoData } from '../../models/service';
import {
  fetchEtapasDeEnsino,
  fetchMunicipio,
  fetchUnidadeFederativa
} from '../../service/escolaApi';
import TrilhaDeNavegacao from '../../components/Navegacao';
import ReactLoading from 'react-loading';
import Table, { CustomTableRow } from '../../components/Table';
import { fetchEscolaRanque, fetchEscolasRanque, fetchProcessamentoRanque } from '../../service/ranqueApi';
import { EscolaRanqueData, EscolaRanqueDetalhes, EscolaRanqueFiltro, ListaPaginada, RanqueProcessamentoData } from '../../models/ranque';
import { notification } from 'antd';
import { FiltroNome } from '../../components/FiltroNome';
import ModalExportarRanque from '../../components/ExportarRanqueModal';
import Select, { SelectItem } from '../../components/Select';
import ModalRanqueEscola from '../../components/EscolaRanqueModal';
import { AuthContext } from '../../provider/Autenticacao';
import { Permissao } from '../../models/auth';
import { useNavigate } from 'react-router-dom';
import { formatDate, formataCustoLogistico } from '../../utils/utils';


function Ranque() {
  const [nome, setNome] = useState('')
  const [uf, setUf] = useState<SelectItem | null>(null);
  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [municipio, setMunicipio] = useState<SelectItem | null>(null);
  const [municipios, setMunicipios] = useState<SelectItem[]>([]);
  const [etapa, setEtapa] = useState<SelectItem | null>(null);
  const [etapas, setEtapas] = useState<SelectItem[]>([]);
  const [escolaDetalhes, setEscolaDetalhes] = useState<EscolaRanqueDetalhes>()

  const [ultimoProcessamento, setUltimoProcessamento] = useState<RanqueProcessamentoData | null>(null);

  const paginas = [{ nome: "Logout", link: "/login" }];
  const [loading, setLoading] = useState(true);
  const [escolas, setEscolas] = useState<ListaPaginada<EscolaRanqueData> | null>(null);
  const colunas = ['Posição', 'Pontuação', 'Escola', 'Etapas de Ensino', 'UF', 'Município', 'UF Polo mais próximo', 'Custo Logístico'];

  const [paginacao, setPaginacao] = useState({ pagina: 1, tamanhoPagina: 10, });
  const [notificationApi, notificationContextHandler] = notification.useNotification();
  const [escolaAtual, setEscolaAtual] = useState<EscolaRanqueData | null>();

  const [showExportModal, setShowExportModal] = useState(false);

  const openExportModal = () => {
    setShowExportModal(true);
  };

  const closeExportModal = () => {
    setShowExportModal(false);
  };

  const navigate = useNavigate();
  const { temPermissao } = useContext(AuthContext);

  const podeExportarRanque = temPermissao(Permissao.RanqueExportar);

  useEffect(() => {
    if (!temPermissao(Permissao.RanqueVisualizar)) {
      navigate("/");
    }

    fetchUnidadeFederativa()
      .then(ufs => setUfs(ufs.map(m => ({ id: m.id.toString(), rotulo: m.sigla }))));
    fetchEtapasDeEnsino()
      .then(etapas => {
        etapas.sort((a, b) => b.descricao.localeCompare(a.descricao));
        setEtapas(etapas.map(e => ({ id: e.id.toString(), rotulo: e.descricao })));
      });
    fetchProcessamentoRanque()
      .then(result => setUltimoProcessamento(result))
      .catch((error) => {
        console.error('Erro ao buscar informações do último processamento:', error);
      });
  }, []);

  useEffect(() => {
    if (!uf?.id) {
      return;
    }
    fetchMunicipio(Number(uf.id)).then(municipios => setMunicipios(municipios.map(m => ({ id: m.id.toString(), rotulo: m.nome }))))
  }, [uf]);

  useEffect(() => {
    const filtro = { ...paginacao, nome: nome.trim().replace(/ +/gm, ' ') } as EscolaRanqueFiltro;

    if (!!uf) {
      filtro.idUf = Number(uf.id);
    }
    if (!!municipio) {
      filtro.idMunicipio = Number(municipio.id);
    }
    if (!!etapa) {
      filtro.idEtapaEnsino = [Number(etapa.id)];
    }

    fetchEscolasRanque(filtro)
      .then(e => {
        if (!!escolas?.items?.length && !!e.items.length && e.items[0]?.ranqueId != escolas?.items[0].ranqueId) {
          notificationApi.success({ message: "A tabela foi atualizada com os resultados do novo processamento" });
        }
        setEscolas(e);
      })
      .finally(() => setLoading(false));
  }, [nome, uf, municipio, etapa, paginacao]);

  const showEscolaInMap = (id: string) => {
    return fetchEscolaRanque(id)
      .then(escolaDetalhes => {
        let latitude = escolaDetalhes.latitude.replace(',', '.');
        let longitude = escolaDetalhes.longitude.replace(',', '.');

        if (!latitude || !longitude) {
          notificationApi.warning({ message: "Não foi possível encontrar essa localização" });
          return;
        }
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        window.open(googleMapsUrl, '_blank');
      })
      .catch(error => {
        console.error("Erro ao obter detalhes da escola", error);
        notificationApi.error({ message: "Não foi possível encontrar essa localização" });
      })
  }

  const formatEtapaEnsino = (etapaEnsino: EtapasDeEnsinoData[], max = 2) => {
    if (!etapaEnsino) {
      return '';
    }
    return `${etapaEnsino.map(etapa => etapa.descricao).slice(0, max).join(', ')}${etapaEnsino.length > max ? '...' : ''}`;
  }

  return (
    <div className="App ranque-container">
      <Header />
      {notificationContextHandler}
      {escolaAtual != null && <ModalRanqueEscola onClose={() => { setEscolaAtual(null) }} onCreateAcao={() => { }} escolaId={escolaAtual.escola.id} />}
      <TrilhaDeNavegacao elementosLi={paginas} />

      <div className='d-flex flex-column m-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <FiltroNome nome={nome} onNomeChange={setNome} />
            <Select items={ufs} value={uf?.id ?? ''} label={"UF:"} onChange={id => setUf(ufs.find(u => u.id == id) ?? null)} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true} />
            <Select items={municipios} value={municipio?.id ?? ''} label={"Municípios:"} onChange={id => setMunicipio(municipios.find(m => m.id == id) ?? null)} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true} />
            <Select items={etapas} value={etapa?.id ?? ''} label={"Etapas de Ensino:"} onChange={id => setEtapa(etapas.find(e => e.id == id) ?? null)} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true} />
          </div>
          {
            ultimoProcessamento &&
            <div className='d-flex align-items-center small-font mr-3'>
              {ultimoProcessamento.emProgresso
                ? `Novo cálculo de ranking iniciado em ${formatDate(ultimoProcessamento.dataInicio)} em processamento...`
                : `Último processamento: ${formatDate(ultimoProcessamento.dataFim)}`
              }
            </div>
          }
        </div>

        {(loading || !escolas?.items?.length) && <Table columsTitle={colunas} initialItemsPerPage={10} totalItems={0} title=""><></><></></Table>}
        {escolas?.items != null &&
          <Table
            columsTitle={colunas}
            title='' initialItemsPerPage={10} totalItems={escolas?.total}
            onNextPage={() => {
              if (paginacao.pagina === escolas?.totalPaginas) return;
              setPaginacao(p => { return { ...p, pagina: p.pagina + 1 } })
            }}
            onPreviousPage={() => {
              if (paginacao.pagina === 1) return;
              setPaginacao({ ...paginacao, pagina: paginacao.pagina - 1 })
            }}
            onPageResize={(tamanhoPagina) => {
              setPaginacao({ ...paginacao, tamanhoPagina })
            }}
            onPageSelect={(pagina) => {
              setPaginacao({ ...paginacao, pagina })
            }}>
            {
              escolas?.items.map((e, index) =>
                <CustomTableRow
                  key={e.escola.id}
                  id={index}
                  data={{
                    '0': `${e.posicao}°`,
                    '1': `${e.pontuacao}`,
                    '2': e.escola.nome,
                    '3': formatEtapaEnsino(e.escola.etapaEnsino),
                    '4': e.escola.uf?.sigla || '',
                    '5': e.escola.municipio?.nome || '',
                    '6': e.escola.distanciaPolo ? e.escola.polo?.uf.sigla : '-',
                    '7': e.escola.distanciaPolo ? formataCustoLogistico(e.escola.distanciaPolo) : '-',
                  }}
                  hideTrashIcon={true}
                  hideEditIcon={true}
                  hideLocationIcon={!e.escola.distanciaPolo}
                  onDetailRow={_ => setEscolaAtual(e)}
                  onLocationRow={_ => showEscolaInMap(e.escola.id)}
                />
              )
            }
          </Table>
        }

        <div className='d-flex justify-content-end mt-4'>
          <ButtonComponent label="Exportar Dados" buttonStyle="primary" onClick={openExportModal} disabled={!podeExportarRanque} />
        </div>

        {showExportModal && (
          <ModalExportarRanque onClose={closeExportModal} />
        )}

        {loading && <div className="d-flex justify-content-center w-100 m-5"><ReactLoading type="spinningBubbles" color="#000000" /></div>}
      </div>

      <Footer />
    </div>
  );
}

export default Ranque;
