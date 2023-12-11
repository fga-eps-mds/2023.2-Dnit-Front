import axios, { AxiosResponse } from "axios";
import * as URL from "../consts/service"
import * as DATA from "../models/service";
import { PoloModel, ListaPaginada } from "../models/polo";
import { ResponseStatus, fetchDados, sendCadastros, update } from "./apiUtils";

export async function sendCadastroPolo(data:DATA.SalvarPoloData):Promise<ResponseStatus>{
    return sendCadastros<DATA.SalvarPoloData>(URL.poloUrl, data);
}

export async function fetchListarPolosFiltrados(filtroTabelaData: DATA.FiltroPoloData): Promise<ListaPaginada<PoloModel>> {
    try {
        const response: AxiosResponse<ListaPaginada<PoloModel>> = await axios.get(
            URL.polosFiltradosUrl,
            filtroTabelaData
        );
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function fetchPolo(id: any) {
    return fetchDados<PoloModel>(`${URL.poloUrl}/${id}`);
}


export async function updatePolo(id: any, polo: DATA.SalvarPoloData){
    const url = `${URL.poloUrl}/${id}`;
    return update<DATA.SalvarPoloData>(url, polo);
}

export async function deletePolo(id: any): Promise<ResponseStatus> {
    const url = `${URL.poloUrl}/${id}`;
    try{
        const response: AxiosResponse<ResponseStatus> = await  axios.delete(url);
        return response.data;
    } catch (error){
        console.error(error);
        throw error;
    }
}