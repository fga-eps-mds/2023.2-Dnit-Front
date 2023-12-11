import * as URL from "../consts/service"
import { fetchDados } from "./apiUtils";
import { EscolaRanqueData, EscolaRanqueDetalhes, EscolaRanqueFiltro, ListaPaginada, RanqueProcessamentoData, RanqueData, RanqueUpdateData } from "../models/ranque";
import axios, { AxiosResponse } from "axios";


export async function fetchEscolasRanque(filtro: EscolaRanqueFiltro): Promise<ListaPaginada<EscolaRanqueData>> {
  return fetchDados<ListaPaginada<EscolaRanqueData>>(URL.listarEscolasRanque, filtro);
}

export async function fetchProcessamentoRanque(): Promise<RanqueProcessamentoData> {
  return fetchDados<RanqueProcessamentoData>(URL.ranqueamentoProcessamento);
}

export async function fetchEscolaRanque(id: string) {
  return fetchDados<EscolaRanqueDetalhes>(`${URL.listarEscolasRanque}/${id}`);
}

export async function fetchRanques(pagina: number, tamanhoPagina: number): Promise<ListaPaginada<RanqueData>> {
  return fetchDados<ListaPaginada<RanqueData>>(URL.listarRanques, {pagina, tamanhoPagina});
}

export async function fetchAtualizarDescricaoRanque(ranqueId: number, novaDescricao: RanqueUpdateData) {
  await axios.put(`${URL.atualizarDescricaoRanque}/${ranqueId}`, novaDescricao);
}

