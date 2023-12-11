export interface periodos{
  intervalos: "0 a 49" | "50 a 99" | "100 a 199" | "200 a 399";
}

export interface PlanejamentoMacroModel {
  nome: string;
  periodo: periodos[]
  qtdAcoes: number | null;
  responsavel: string;
}

export interface ListaPaginada<T> {
  pagina: number;
  itemsPorPagina: number;
  total: number;
  totalPaginas: number;
  items: T[];
}