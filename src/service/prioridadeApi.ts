import { CustoLogisticoModel, FatorModel, Porte, Propriedade } from "../models/prioridade";
import * as URL from "../consts/service"
import { ResponseStatus, fetchDados, sendCadastros, update } from "./apiUtils";
import axios, { AxiosResponse } from "axios";

export async function fetchCustosLogisticos(): Promise<CustoLogisticoModel[]> {
    return fetchDados(URL.obterCustosLogisticos);
}

export async function fetchFatoresPriorizacao(): Promise<FatorModel[]> {
    return fetchDados(URL.listarFatores);
}

export async function fetchFatorPriorizacao(id: string): Promise<FatorModel> {
    return fetchDados(URL.visualizarFator, id);
}

export async function adicionarFatorPriorizacao(novoFator: FatorModel): Promise<FatorModel> {
    const url = `${URL.adicionarFator}`;
    try {
        const response: AxiosResponse<FatorModel> = await axios.post(url, novoFator)
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function deletarFatorPriorizacao(id: string): Promise<ResponseStatus> {
    const url = `${URL.deletarFator}/${id}`;
    try {
        const response: AxiosResponse<ResponseStatus> = await axios.delete(url)
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function editarFatorPriorizacao(id: string, novoFator: FatorModel): Promise<FatorModel> {
    const url = `${URL.editarFator}/${id}`;
    try {
        const response: AxiosResponse<FatorModel> = await axios.put(url, novoFator);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function editarCustosLogisticos(items: CustoLogisticoModel[]): Promise<ResponseStatus>{
    return update(URL.editarCustosLogisticos, items);
}

export async function fetchPropriedades(): Promise<Propriedade[]> { 
    return fetchDados(URL.ObterPropriedades)
}

export async function fetchPorte(): Promise<Porte[]> { 
    return fetchDados(URL.ObterPorte)
}
