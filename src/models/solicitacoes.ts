import { EtapasDeEnsinoData, MunicipioData} from "./service";

export interface ListaPaginada<T> {
    pagina: number;
    itemsPorPagina: number;
    total: number;
    totalPaginas: number;
    items: T[];
}

export interface SolicitacaoEscolaData {
    idEscola: number;
    codigoEscola: number;
    nomeEscola: string;
    rede: string;
    cep: string;
    idUf: number;
    siglaUf: string;
    endereco: string;
    idMunicipio: number;
    nomeMunicipio: string;
    localizacao: string;
    longitude: string;
    latitude: string;
    idEtapasDeEnsino: number;
    etapaEnsino?: [];
    numeroTotalDeAlunos: number;
    idSituacao: number;
    situacao: string;
    porte: string;
    telefone: string;
    numeroTotalDeDocentes: number;
    distanciaPolo: number;
    poloId: number;
  }

export interface SolicitacoesData{
    id: string;
    escola?: SolicitacaoEscolaData;
    codigoEscola: string;
    escolaCadastrada: boolean;
    nome: string
    nomeSolicitante: string;
    quantidadeAlunos: number;
    vinculo: string;
    email: string;
    telefone: string;
    observacoes?: string;
    dataRealizadaUtc: string;
    uf: string;
    municipio: MunicipioData;

}

