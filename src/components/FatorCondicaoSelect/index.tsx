import { useEffect, useState } from "react";
import { FilterOptions } from "../../pages/gerencia/GerenciarUsuario";
import MultiSelect from "../MultiSelect";
import Select, { SelectItem } from "../Select";
import { Condicao, Localizacao, Operador, Rede } from "../../models/prioridade";
import { fetchPorte } from "../../service/prioridadeApi";
import { fetchSituacao, fetchUnidadeFederativa } from "../../service/escolaApi";

interface CondicaoProps
{
    readonly onChange: (condicao:Condicao, i: number) => void;
    readonly index: number;
    readonly condicao: Condicao;
    readonly condicaoUfs?: FilterOptions[];
    readonly propriedades?: FilterOptions[];
    readonly municipios?: FilterOptions[];
    readonly situacoes?: FilterOptions[];
    readonly etapasEnsino?: FilterOptions[];
    readonly porte?: FilterOptions[];
}

interface CondicaoOptions {
    valores: FilterOptions[];
    operadores: FilterOptions[];
    propriedadeSelecionada: string;
    operadorSelecionado: string;
    valoresSelecionados: string[];
}

const SelecionarOperadores = (propriedade: string) => {
    if (propriedade == "6") {
        return [
            { id: Operador.maior, rotulo: "maior ou igual a"},
            { id: Operador.menor, rotulo: "menor ou igual a"}
        ]
    }
    else {
        return [
            { id: Operador.igual, rotulo: "igual a"}
        ]
    }
}

async function obterPortesEscolas(): Promise<FilterOptions[]> {
    const listaPortesEscolas = await fetchPorte();
    const novoPorte = listaPortesEscolas.map((u) => ({ id: u.id, rotulo: u.descricao }));
    return novoPorte;
}

async function fetchUf(): Promise<FilterOptions[]> {
    const listaUfs = await fetchUnidadeFederativa();
    const novaUf = listaUfs.map((u) => ({ id: '' + u.id, rotulo: u.sigla }));
    return novaUf;
    // setListaUfs(novaUf);
}

const getSituacao = async (): Promise<FilterOptions[]> => {
    const resposta = await fetchSituacao();
    const r = resposta.map((item) => {
        return { id: String(item.id), rotulo: item.descricao }
    })
    return r;
};

const getLocalizacao = async (): Promise<FilterOptions[]> => {
    return [
        { id: Localizacao.Rural, rotulo: "Rural" },
        { id: Localizacao.Urbana, rotulo: "Urbana" }
    ]
}

const getRede = async (): Promise<FilterOptions[]> => {
    return [
        { id: Rede.Estadual, rotulo: "Estadual" },
        { id: Rede.Municipal, rotulo: "Municipal" },
        { id: Rede.Privada, rotulo:"Privada" }
    ]
}

const getPropriedadeCallback = (propriedade: String) => {
    if (propriedade == "1") return obterPortesEscolas;
    if (propriedade == "2") return getSituacao;
    if (propriedade == "4") return fetchUf;
    if (propriedade == "5") return getLocalizacao;
    if (propriedade == "8") return getRede;
    else return async () => [];
}

export default function FatorCondicaoSelect({index, condicao, propriedades, onChange}:CondicaoProps) {
    
    const [condicaoState, setCondicaoState] = useState<CondicaoOptions>(
        { 
            valores: [],
            operadores: SelecionarOperadores(String(condicao.propriedade)),
            propriedadeSelecionada: String(condicao.propriedade),
            operadorSelecionado: String(condicao.operador),
            valoresSelecionados: condicao.valores
        }
    );

    const [propriedadeSelecionada, setPropriedadeSelecionada] = useState<string>('');
    const [optionValores, setOptionValores] = useState<FilterOptions[]>([]);

    useEffect(() => {
        setCondicaoState({
            ...condicaoState,
            propriedadeSelecionada: propriedadeSelecionada,
            valores: optionValores
        })
    }, [optionValores])

    useEffect(() => {
        const callback = getPropriedadeCallback(propriedadeSelecionada);
        callback().then(options => {
            setOptionValores(options);
        })
    }, [propriedadeSelecionada]);

    useEffect(() => {
        setPropriedadeSelecionada(condicaoState.propriedadeSelecionada);
    }, [])

    useEffect(() => {
        if (condicaoState.propriedadeSelecionada)
        onChange({
            propriedade: Number(condicaoState.propriedadeSelecionada), 
            operador: Number(condicaoState.operadorSelecionado), 
            valores: condicaoState.valoresSelecionados
        }, index);
    }, [condicaoState])

    const selectPropriedades: SelectItem[] = propriedades?.map((item) => {
        return {
            id: String(item.id),
            rotulo: item.rotulo
        }
    }) ?? []

    return (
        <div style={{display: "flex"}}>
            <Select items={selectPropriedades} value={condicaoState.propriedadeSelecionada} onChange={(c) => {
                setPropriedadeSelecionada(c);
            }} />
            <Select items={condicaoState.operadores} value={condicaoState.operadorSelecionado} onChange={(e) => setCondicaoState({...condicaoState, operadorSelecionado: e})} />
            {condicaoState.propriedadeSelecionada != "6" ? <MultiSelect items={condicaoState.valores} value={condicaoState.valoresSelecionados} onChange={(e) => setCondicaoState({...condicaoState, valoresSelecionados: e})} />:
            <input type="number"></input>
            }
        </div>          
    )
}