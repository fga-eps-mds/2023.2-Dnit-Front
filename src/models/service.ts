export interface FederativeUnit {
  id: number;
  sigla: string;
  descricao: string;
}

export interface LoginData {
  email: string;
  senha: string;
  nome: string;
  uf: number;
}

export interface RegisterData {
  email: string;
  senha: string;
  nome: string;
  uf: number;
}


export interface InfoEscolaData {
  id: number;
}

export interface SalvarSituacaoData{
  idSituacao: number,
  idEscola: number
}

export interface RecoverPasswordData {
  nome: string;
  email: string;
  senha: string;
}

export interface ResetPasswordData {
  uuidAutenticacao: string;
  senha: string;
}
