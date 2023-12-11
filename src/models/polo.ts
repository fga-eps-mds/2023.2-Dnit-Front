import {MunicipioData, UnidadeFederativaData } from "./service";


export interface PoloModel {
    id: number;
    endereco: string;
    cep: string;
    latitude: string;
    longitude: string;
    nome: string;
    municipio: MunicipioData;
    uf: UnidadeFederativaData;
}

export interface ListaPaginada<T> {
    pagina: number;
    itemsPorPagina: number;
    total: number;
    totalPaginas: number;
    items: T[];
}
