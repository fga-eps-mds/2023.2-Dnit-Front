import { MunicipioData } from "../../models/service";
import { SolicitacaoEscolaData, SolicitacoesData } from "../../models/solicitacoes";


const escola1: SolicitacaoEscolaData = {
  idEscola: 227,
  codigoEscola: 41127226,
  nomeEscola: "Escola A",
  rede: '1',
  cep: "82860130",
  idUf: 1,
  endereco:
    "RUA JOAO BATISTA SCUCATO, 80 ATUBA. 82860-130 Curitiba - PR.",
  idMunicipio: 5200050,
  nomeMunicipio: "Abadia de Goiás",
  localizacao: '1',
  longitude: "-49,2011",
  latitude: "-25,38443",
  etapaEnsino: [],
  numeroTotalDeAlunos: 200,
  idSituacao: 1,
  situacao: "Escola Crítica",
  porte: '1',
  telefone: "32562393",
  numeroTotalDeDocentes: 200,
  siglaUf: "AC",
  distanciaPolo: 369.04769287884994,
  idEtapasDeEnsino: 1,
  poloId: 1,

}

export const solicitacao: SolicitacoesData = {
  id: '1234567',
  escola: escola1,
  codigoEscola: '41127226',
  nome: 'Escola A',
  nomeSolicitante: 'Jhonas Teste',
  quantidadeAlunos: 49,
  vinculo: 'Professor',
  email: 'jhonas.prof@gmail.com',
  telefone: '7533445566',
  observacoes: 'Preciso de uma visita. Existem muito acidentes',
  dataRealizadaUtc: '0001-01-01T00:00:00',
  uf: 'AC',
  municipio: {nome: 'Acrelândia', id: 1200013},
  escolaCadastrada: true,
}

export const solicitacaoSemEscola: SolicitacoesData = {
  id: '1234567',
  escola: undefined,
  codigoEscola: '41127226',
  nome: 'Outra Escola',
  nomeSolicitante: 'Outro Jhonas',
  quantidadeAlunos: 49,
  vinculo: 'Professor',
  email: 'jhonas.outro@gmail.com',
  telefone: '7533445588',
  observacoes: undefined,
  dataRealizadaUtc: '0001-01-01T00:00:00',
  uf: 'AC',
  municipio: {nome: 'Acrelândia', id: 1200013},
  escolaCadastrada: false,
}
