import {fetchDados, ResponseStatus, sendCadastros, update} from "./apiUtils";
import * as DATA from "../models/service";
import * as URL from "../consts/service"
import {PlanejamentoMacro} from "../models/gerenciarAcoes";
import axios, { AxiosResponse } from "axios";
import { AtualizarPlanejamento } from "../models/service";

//envia cadastro de planejamento macro
export async function sendPlanejamento(data: DATA.CriarPlanejamentoRequest): Promise<ResponseStatus> {
    return sendCadastros<DATA.CriarPlanejamentoRequest>(URL.criaPlanejamento, data);
}

export async function fetchPlanejamentos(filtroTabelaData: DATA.PesquisaPlanejamentoFiltro): Promise<DATA.PlanejamentoFiltrados> {
    try {
        const response: AxiosResponse<DATA.PlanejamentoFiltrados> = await axios.get(
            URL.obterPlanejamento,
            filtroTabelaData
        );
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
//busca planejamento macro específico por id
export async function fetchPlanejamentoId(id: string): Promise<PlanejamentoMacro> {
    return fetchDados<PlanejamentoMacro>(`${URL.obterPlanejamento}/${id}`);
}

export async function deletePlanejamentoMacro(idPlanejamento: string): Promise<ResponseStatus>{
    try{
        const response: AxiosResponse<ResponseStatus> = await axios.delete(
            URL.excluiPlanejamento + "/" + idPlanejamento
        );
        return response.data;
    } 
    catch (error){
        console.error(error);
        throw error;
    }
}

export async function deleteEscolaPlanejamento(idEscola: string): Promise<ResponseStatus>{
    try{
        const response: AxiosResponse<ResponseStatus> = await axios.delete(
            URL.excluiEscolaPlanejamento, { params: { id: idEscola}}
        ) ;
        return response.data
    } catch (error){
        console.error(error);
        throw error;
    }
}

export async function updatePlanejamento(id: string, data: AtualizarPlanejamento): Promise<PlanejamentoMacro> {
    try {
        const response: AxiosResponse<PlanejamentoMacro> = await axios.put(
            `${URL.criaPlanejamento}/${id}`, data
        );
        return response.data
    } catch (error){
        console.log(error);
        throw error;
    }
} 