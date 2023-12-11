export interface EscolasPlanejamentoTabela {
    ups: number;
    nome: string;
    uf: string;
    quantidadeAlunos: number;
    custoLogistico: number;
    id: string;
}

export interface PlanejamentoMacro {
  id: string;
  nome: string;
  responsavel: string;
  mesInicio: number;
  mesFim: number;
  anoInicio: string;
  anoFim: string;
  quantidadeAcoes: number;
  planejamentoMacroMensal: InfoMesPlanejamentoMacro[];
}

export interface InfoMesPlanejamentoMacro {
  mes: number;
  ano: string;
  upsTotal: number;
  quantidadeEscolasTotal: number;
  quantidadeAlunosTotal: number;
  escolas: EscolaPlanejamentoModel[];
  detalhesPorUF: InfoUFPlanejamento[];
}

export interface EscolaPlanejamentoMacro {
  id: string;
  ups: number;
  nome: string;
  uf: string;
  quantidadeAlunos: number;
  distanciaPolo: number;
}

export interface InfoUFPlanejamento {
  uf: string;
  quantidadeEscolasTotal: number;
}

export interface EscolaPlanejamentoModel {
  id: string;
  ups: number;
  nome: string;
  uf: string;
  quantidadeAlunos: number;
  distanciaPolo: number;
}
