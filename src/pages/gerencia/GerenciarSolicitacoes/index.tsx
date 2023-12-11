import { notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioModel } from "../../../models/usuario";
import Header from "../../../components/Header";
import Table, { CustomTableRow } from "../../../components/Table";
import Footer from "../../../components/Footer";
import { fetchUsuariosEmpresa } from "../../../service/empresaApi";
import TrilhaDeNavegacao from "../../../components/Navegacao";
import InputFilter from "../../../components/InputFilter";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";
import { FilterOptions } from "../GerenciarUsuario";
import { fetchMunicipio, fetchSolicitacoesAcoes, fetchUnidadeFederativa } from "../../../service/escolaApi";
import { fetchPerfis } from "../../../service/usuarioApi";
import Select from "../../../components/Select";
import RemoverUsuarioEmpresaDialog from "../../../components/RemoverUsuarioEmpresaDialog";
import { AuthContext } from "../../../provider/Autenticacao";
import { Permissao } from "../../../models/auth";
import { ButtonComponent } from "../../../components/Button";
import AdicionarUsuarioDialog from "../../../components/AdicionarUsuarioDialog";
import { SolicitacaoDeAcaoDTO } from "../../../models/service";
import { SolicitacoesData } from "../../../models/solicitacoes";
import SolicitacoesDialog from "../../../components/SolicitacoesDialog";
import CadastroManual from "../../../components/cadastrarEscolas/CadastroManual";
import { formataCustoLogistico } from "../../../utils/utils";
import { CadastroEscolaDialog } from "../../../components/CadastroEscolaDialog";


export default function GerenciarSolicitacoes() {
  const paginas = [{ nome: "Gerenciar Solicitações de Açoes", link: "/gerenciarSolicitacaoAcao" }];
  const [notificationApi, notificationContextHandler] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [listaSolicitacoes, setListaSolicitacoes] = useState<SolicitacoesData[]>([]);
  const [escola, setEscola] = useState('');
  const [uf, setUf] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [qtdAlunos, setQtdAlunos] = useState('');
  const [quantidadeAlunosMin, setQuantidadeAlunosMin] = useState(1);
  const [quantidadeAlunosMax, setQuantidadeAlunosMax] = useState(5000);
  const [listaUfs, setListaUfs] = useState<FilterOptions[]>([]);
  const [listaMunicipios, setListaMunicipios] = useState<FilterOptions[]>([]);
  const [listaQtdAlunos] = useState<FilterOptions[]>([
    { id: '1', rotulo: 'Até 50' },
    { id: '2', rotulo: 'Entre 51 e 200' },
    { id: '3', rotulo: 'Entre 201 e 500' },
    { id: '4', rotulo: 'Entre 501 e 1000' },
    { id: '5', rotulo: 'Mais que 1001' }
  ]);
  const { temPermissao } = useContext(AuthContext);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [tamanhoPagina, setTamanhoPagina] = useState(10);
  const [solicitacaoAtual, setSolicitacaoAtual] = useState<SolicitacoesData | undefined>();
  const [cadastrarEscola, setCadastrarEscola] = useState<SolicitacoesData | undefined>();



  const buscarSolicitacoes = (proximaPagina: number, novoTamanhoPagina: number = tamanhoPagina) => {
    fetchSolicitacoesAcoes(proximaPagina, novoTamanhoPagina, escola, uf, municipio, quantidadeAlunosMin, quantidadeAlunosMax)
      .then(pagina => {
        setPagina(pagina.pagina)
        setListaSolicitacoes(pagina.items)
        setTotalPaginas(pagina.totalPaginas)
        setTamanhoPagina(pagina.itemsPorPagina)
      })
      .catch(error => notificationApi.error({ message: 'Falha na listagem de solicitacoes. ' + (error?.response?.data || '') }))
  }

  async function fetchUf(): Promise<void> {
    const listaUfs = await fetchUnidadeFederativa();
    const novaUf = listaUfs.map((u) => ({ id: '' + u.id, rotulo: u.sigla }));
    setListaUfs(novaUf);
  }

  async function fetchMunicipios(): Promise<void> {
    const listaMunicipios = await fetchMunicipio(Number(uf));
    const novoMunicipio = listaMunicipios.map((u) => ({ id: '' + u.id, rotulo: u.nome }));
    setListaMunicipios(novoMunicipio);
  }

  function atualizaFiltroAlunos(minMaxAlunos: string) {
    console.log(minMaxAlunos);
    switch (minMaxAlunos) {
      case '1': {
        setQuantidadeAlunosMin(1);
        setQuantidadeAlunosMax(50);
        break;
      }
      case '2': {
        setQuantidadeAlunosMin(51);
        setQuantidadeAlunosMax(200);
        break;
      }
      case '3': {
        setQuantidadeAlunosMin(201);
        setQuantidadeAlunosMax(500);
        break;
      }
      case '4': {
        setQuantidadeAlunosMin(501);
        setQuantidadeAlunosMax(1000);
        break;
      }
      case '5': {
        setQuantidadeAlunosMin(1001);
        setQuantidadeAlunosMax(10000);
        break;
      }
      default: {
        //reseta o filtro para todos; 
        setQuantidadeAlunosMin(1);
        setQuantidadeAlunosMax(10000);
        break;
      }
    }

  }

  useEffect(() => {
    buscarSolicitacoes(pagina, tamanhoPagina);
  }, [escola, uf, municipio, quantidadeAlunosMax, pagina, tamanhoPagina]);

  useEffect(() => {
    fetchMunicipios();
  }, [uf]);

  useEffect(() => {
    atualizaFiltroAlunos(qtdAlunos);
  }, [qtdAlunos])

  useEffect(() => {
    fetchUf();
  }, []);

  return (
    <div className="App">
      {notificationContextHandler}
      <Header />
      {solicitacaoAtual != null && <SolicitacoesDialog escolaSelecionada={solicitacaoAtual} onClose={() => { setSolicitacaoAtual(undefined) }} onCreateAcao={() => { }} />}
      {cadastrarEscola != undefined && <CadastroEscolaDialog dadosSoliciatacao={cadastrarEscola} closeDialog={() => setCadastrarEscola(undefined)} />}
      <TrilhaDeNavegacao elementosLi={paginas} />
      <div className="d-flex flex-column m-5">
        <div className="d-flex justify-content-left align-items-center mr-5">
          <InputFilter onChange={setEscola} dataTestId="filtroEscola" label="Escola" placeholder="Escola" />
          <Select items={listaQtdAlunos} value={qtdAlunos} label={"Qtd. Alunos:"} onChange={setQtdAlunos} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true} />
          <Select items={listaUfs} value={uf} label={"UF:"} onChange={setUf} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true} />
          <Select items={listaMunicipios} value={municipio} label={"Municipios:"} onChange={setMunicipio} dropdownStyle={{ marginLeft: "20px", width: "260px" }} filtrarTodos={true} />
        </div>
        {listaSolicitacoes.length === 0 && <Table columsTitle={['Escola', 'Qtd. de Alunos', 'UF', 'Municipio', 'Custo Logístico']} initialItemsPerPage={10} title="Soliciatações de Ações"><></><></></Table>}

        <Table
          columsTitle={['Escola', 'Qtd. de Alunos', 'UF', 'Municipio', 'Custo Logístico']}
          initialItemsPerPage={tamanhoPagina}
          title="Soliciatações de Ações"
          totalPages={totalPaginas}
          totalItems={100}
          onNextPage={() => {
            if (pagina === totalPaginas) return;
            buscarSolicitacoes(pagina + 1, tamanhoPagina)
          }}
          onPreviousPage={() => {
            if (pagina === 1) return;
            buscarSolicitacoes(pagina - 1, tamanhoPagina)
          }}
          onPageResize={(newItensPerPage) => {
            setTamanhoPagina(newItensPerPage)
          }}
          onPageSelect={(newSelectedPage) => {
            setPagina(newSelectedPage)
          }}
        >
          {
            listaSolicitacoes.map((solicitacao, index) =>
              <CustomTableRow key={`${solicitacao.id}-${index}`} id={index}
                data={{
                  '0': solicitacao.escola?.nomeEscola || solicitacao.nome.toUpperCase(),
                  '1': solicitacao.escola?.numeroTotalDeAlunos !== undefined ? `${solicitacao.escola.numeroTotalDeAlunos}` : `${solicitacao.quantidadeAlunos}`,
                  '2': solicitacao.escola?.siglaUf !== undefined ? `${solicitacao.escola?.siglaUf}` : solicitacao.uf,
                  '3': solicitacao.escola?.idMunicipio !== undefined ? `${solicitacao.escola?.nomeMunicipio}` : solicitacao.municipio.nome,
                  '4': solicitacao.escola?.distanciaPolo !== undefined ? formataCustoLogistico(solicitacao.escola.distanciaPolo) : 'Escola não Cadastrada'
                }}
                hideEyeIcon={false}
                hideTrashIcon={true}
                hideEditIcon={true}
                hidePlusIcon={solicitacao.escola === null && temPermissao(Permissao.EscolaCadastrar) ? false : true}
                onDetailRow={_ => setSolicitacaoAtual(solicitacao)}
                onPlusRow={_ => setCadastrarEscola(solicitacao)}

              />
            )
          }
        </Table>
        {loading && <div className="d-flex justify-content-center w-100 m-5"><ReactLoading type="spinningBubbles" color="#000000" /></div>}
      </div>
      <Footer />
    </div>
  )
}