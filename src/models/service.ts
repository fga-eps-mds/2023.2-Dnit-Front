import { PlanejamentoMacro } from "./gerenciarAcoes";

export interface UnidadeFederativaData {
  id: number;
  nome: string;
  sigla: string;
}

export interface ViaCEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
  sigla: string;
  descricao: string;
}

export interface MunicipioData {
  id: number;
  nome: string;
}

export interface EnumData {
  id: number;
  descricao: string;
}

export type SituacaoData = EnumData;
export type EtapasDeEnsinoData = EnumData;
export type LocalizacaoData = EnumData;
export type RedeData = EnumData;
export type Propriedade =EnumData;

export interface LoginData {
  email: string;
  senha: string;
  nome: string;
  uf: number;
}

export interface CadastroUsuarioData {
  email: string;
  senha: string;
  nome: string;
  ufLotacao: number;
  municipioId: number;
}

export interface CadastroUsuarioTerceiroData {
  email: string;
  senha: string;
  nome: string;
  ufLotacao: number;
  municipioId: number;
  cnpj: string; 
}

export interface CadastroEscolaData {
  NomeEscola: string;
  IdRede: number;
  CodigoEscola: number;
  IdUf: number;
  Cep: string;
  Telefone: string;
  IdEtapasDeEnsino: number;
  IdPorte: number;
  Endereco: string;
  //IdMunicipio: number,
  IdLocalizacao: number;
  Longitude: string;
  Latitude: string;
  NumeroTotalDeAlunos: number;
  NumeroTotalDeDocentes: number;
}

export interface RecuperarSenhaData {
  nome: string;
  email: string;
  senha: string;
}
export interface ExcluirEscolaData {
  id_escola: number;
}

export interface InfoEscolaData {
  id: number;
}

export interface RedefinirSenhaData {
  uuidAutenticacao: string;
  senha: string;
}

export interface InserirArquivoData {
  arquivo: File;
}
export interface EscolaData {
  idEscola: number;
  codigoEscola: number;
  nomeEscola: string;
  idRede: number;
  descricaoRede: string;
  cep: string;
  idUf: number;
  siglaUf: string;
  endereco: string;
  idMunicipio: number;
  nomeMunicipio: string;
  idLocalizacao: number;
  descricaoLocalizacao: string;
  longitude: string;
  latitude: string;
  idEtapasDeEnsino: number;
  etapaEnsino: {};
  numeroTotalDeAlunos: number;
  idSituacao: number;
  descricaoSituacao: string;
  idPorte: number;
  descricaoPorte: string;
  telefone: string;
  numeroTotalDeDocentes: number;
  observacao: string;
  distanciaPolo: number;
  poloId: number;
}

export interface FiltroEscolaData {
  params: {
    Pagina: number;
    TamanhoPagina: number;
    Nome: string;
    IdSituacao: string | number;
    IdMunicipio: string | number;
    IdUf: string | number;
  };
}

export interface FiltroPoloData {
    params: {
        Pagina: number;
        TamanhoPagina: number;
        Nome: string;
        Cep: string;
        idUf: string | number;
        idMunicipio: string | number;
    };
}

export interface EscolasFiltradasResponse {
  escolas: EscolaData[];
  escolasPorPagina: number;
  totalEscolas: number;
  totalPaginas: number;
}

export interface PolosFiltradosResponse {
    polos: PoloData[];
    polosPorPagina: number;
    totalPolos: number;
    totalPaginas: number;
}

export interface AlterarDadosEscolaData {
  idEscola: number;
  idSituacao: number;
  telefone: string;
  longitude: string;
  latitude: string;
  numeroTotalDeAlunos: number;
  numeroTotalDeDocentes: number;
  observacao: string;
  idEtapasDeEnsino: [];
  ultimaAtualizacao: string;
}

export interface ExcluirSituacaoData {
  idEscola: number;
}
export interface EscolaInepData {
  cod: number;
  estado: string;
  nome: string;
}

export interface SolicitacaoDeAcaoDTO {
  Escola: string;
  EscolaCodigoInep: string;
  Uf: number;
  Municipio: string
  MunicipioId: number;
  NomeSolicitante: string;
  VinculoEscola: string;
  Email: string;
  Telefone: string;
  CiclosEnsino: string[];
  QuantidadeAlunos: number;
  Observacoes: string | undefined;
}

export interface CalcularUpsData {
  latitude: number;
  longitude: number;
}

export interface CalcularUpsResponse {
  status: number;
  ups2018: number;
  ups2019: number;
  ups2020: number;
  ups2021: number;
  ups2022: number;
  upsGeral: number;
}

export interface SalvarEmpresaData {
  Cnpj: string;
  RazaoSocial: string;
  UFs: number[];
}

export interface GerenciarUsuarioEmpresaData {
  cnpj: string;
  usuarioid: string;
}
export interface UfModel {
  id: number;
  sigla: string;
  nome: string;
}

export interface Fatores {
  nome: string;
  peso: number;
  valor: number;
}

export interface RanqueInfo {
  ranqueId: number;
  pontuacao: number;
  posicao: number;
  fatores: Fatores[];
}


export interface CriarPlanejamentoRequest {
  nome: string;
  responsavel: string;
  mesInicio: number;
  mesFim: number;
  anoInicio: string;
  anoFim: string;
  quantidadeAcoes: number;
}

export interface ExcluirPlanejamentoData {
  id_planejamento: string;
}

export interface PesquisaPlanejamentoFiltro {
  params: {
    Pagina: number;
    TamanhoPagina: number;
    Nome?: string;
    Periodo?: string;
    Responsavel?: string;
    QuantidadeAcoes?: number;
  };
}

export interface PlanejamentoFiltrados {
  pagina: number;
  itemsPorPagina: number;
  total: number;
  totalPaginas: number;
  items: PlanejamentoMacro[];
}

export interface AtualizarPlanejamento {
  nome: string;
  planejamentoMacroMensal: PlanejamentoMacroMesUpdate[];
}

export interface PlanejamentoMacroMesUpdate {
    mes: number;
    ano: string;
    escolas: string[]
}
export interface PoloData {
    id: number;
    endereco: string;
    cep: string;
    latitude: string;
    longitude: string;
    nomeMunicipio: string;
    nome: string;
    uf: number;
}

export interface SalvarPoloData {
  endereco: string;
  cep: string;
  latitude: string;
  longitude: string;
  municipioId: number;
  nome: string;
  idUf: number;
}