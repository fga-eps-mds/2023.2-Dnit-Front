export interface CustoLogisticoModel {
    custo: number;
    raioMin: number;
    raioMax: number | null;
    valor: number;
}

export interface Condicao {
    id?: string;
    propriedade: number | string;
    operador: number | string;
    valores: string[];
    fatorPriorizacaoId?: string;
}

export interface FatorModel {
    id?: string;
    nome: string;
    peso: number;
    ativo: boolean;
    primario: boolean;
    fatorCondicoes: Condicao[];
}

export interface Propriedade {
    id: string;
    rotulo: string;
}

export interface Porte {
    id: string;
    descricao: string;
}

export enum Operador {
    igual = "1",
    maior = "2",
    menor = "3",
}

export enum Rede {
    Municipal = "1",
    Estadual = "2",
    Privada = "3",
}

export enum Localizacao{
    Rural = "1",
    Urbana = "2",
}