import {EscolasPlanejamentoTabela, PlanejamentoMacro} from "../../models/gerenciarAcoes";
import { EscolasFiltradasResponse, PlanejamentoFiltrados } from "../../models/service";

export const planejamento: PlanejamentoMacro = {
    id: "1",
    nome: "Planejamento 1",
    responsavel: "Fulano",
    mesInicio: 1,
    mesFim: 6,
    anoInicio: "2023",
    anoFim: "2023",
    quantidadeAcoes: 3,
    planejamentoMacroMensal: [
        {
            mes: 1,
            ano: "2023",
            upsTotal: 10,
            quantidadeEscolasTotal: 5,
            quantidadeAlunosTotal: 500,
            escolas: [
                {
                    id: "1",
                    ups: 1,
                    nome: "Escola 1",
                    uf: "SP",
                    quantidadeAlunos: 100,
                    distanciaPolo: 20,
                },
            ],
            detalhesPorUF: [
                {
                    uf: "SP",
                    quantidadeEscolasTotal: 3,
                },
            ],
        },
    ],
};

export const planejamento2: PlanejamentoMacro = {
    id: "2",
    nome: "Planejamento 1",
    responsavel: "Fulano",
    mesInicio: 1,
    mesFim: 6,
    anoInicio: "2023",
    anoFim: "2023",
    quantidadeAcoes: 3,
    planejamentoMacroMensal: [
        {
            mes: 1,
            ano: "2023",
            upsTotal: 10,
            quantidadeEscolasTotal: 5,
            quantidadeAlunosTotal: 500,
            escolas: [
                {
                    id: "1",
                    ups: 1,
                    nome: "Escola 1",
                    uf: "SP",
                    quantidadeAlunos: 100,
                    distanciaPolo: 20,
                },
                {
                    id: "2",
                    ups: 1,
                    nome: "Escola 2",
                    uf: "SP",
                    quantidadeAlunos: 100,
                    distanciaPolo: 20,
                },
            ],
            detalhesPorUF: [
                {
                    uf: "SP",
                    quantidadeEscolasTotal: 3,
                },
            ],
        },
        {
            mes: 2,
            ano: "2023",
            upsTotal: 100,
            quantidadeEscolasTotal: 1,
            quantidadeAlunosTotal: 2500,
            escolas: [
                {
                    id: "1",
                    ups: 1,
                    nome: "Escola Teste",
                    uf: "RJ",
                    quantidadeAlunos: 201,
                    distanciaPolo: 190,
                },
            ],
            detalhesPorUF: [
                {
                    uf: "RJ",
                    quantidadeEscolasTotal: 1,
                },
            ],
        },
    ],
};

export const planejamento2Updated: PlanejamentoMacro = {
    id: "2",
    nome: "Planejamento 1",
    responsavel: "Fulano",
    mesInicio: 1,
    mesFim: 6,
    anoInicio: "2023",
    anoFim: "2023",
    quantidadeAcoes: 4,
    planejamentoMacroMensal: [
        {
            mes: 1,
            ano: "2023",
            upsTotal: 14,
            quantidadeEscolasTotal: 2,
            quantidadeAlunosTotal: 1200,
            escolas: [
                
                {
                    id: "1",
                    ups: 1,
                    nome: "Escola Teste",
                    uf: "RJ",
                    quantidadeAlunos: 201,
                    distanciaPolo: 190,
                },
                {
                    id: "2",
                    ups: 1,
                    nome: "Escola 2",
                    uf: "SP",
                    quantidadeAlunos: 100,
                    distanciaPolo: 20,
                },
            ],
            detalhesPorUF: [
                {
                    uf: "SP",
                    quantidadeEscolasTotal: 1,
                },
                {
                    uf: "RJ",
                    quantidadeEscolasTotal: 1,
                },
            ],
        },
        {
            mes: 2,
            ano: "2023",
            upsTotal: 112,
            quantidadeEscolasTotal: 2,
            quantidadeAlunosTotal: 100,
            escolas: [
                {
                    id: "1",
                    ups: 1,
                    nome: "Escola 1",
                    uf: "SP",
                    quantidadeAlunos: 100,
                    distanciaPolo: 20,
                },
            ],
            detalhesPorUF: [
                {
                    uf: "SP",
                    quantidadeEscolasTotal: 1,
                },
            ],
        },
    ],
};

export const escolaSelected: EscolasPlanejamentoTabela={
    ups: 12,
    nome: "Escola A",
    uf: "DF",
    quantidadeAlunos: 1000,
    custoLogistico: 2,
    id: "asdasasa"
}

export const fetchPlanejamentosResponse: PlanejamentoFiltrados = {
    
        "pagina": 1,
        "itemsPorPagina": 10000,
        "total": 8,
        "totalPaginas": 1,
        "items": [
            {
                "planejamentoMacroMensal": [
                    {
                        "mes": 3,
                        "ano": "2023",
                        "upsTotal": 2787,
                        "quantidadeEscolasTotal": 2,
                        "quantidadeAlunosTotal": 669,
                        "escolas": [
                            {
                                "id": "ec1107a4-4f85-43f5-ac8f-4b011ff2ffa9",
                                "ups": 1333,
                                "nome": "IEE MARECHAL RONDON",
                                "uf": "RO",
                                "quantidadeAlunos": 575,
                                "distanciaPolo": 318.82236091941206
                            },
                            {
                                "id": "d996c1e4-2d89-4dfc-bac2-034f82a5c1d5",
                                "ups": 1454,
                                "nome": "EM - ESCOLA MUNICIPAL ENGENHO NOVO",
                                "uf": "PE",
                                "quantidadeAlunos": 94,
                                "distanciaPolo": 20.403647776845823
                            }
                        ],
                        "detalhesPorUF": [
                            {
                                "uf": "RO",
                                "quantidadeEscolasTotal": 1
                            },
                            {
                                "uf": "PE",
                                "quantidadeEscolasTotal": 1
                            }
                        ]
                    },
                    {
                        "mes": 2,
                        "ano": "2023",
                        "upsTotal": 233,
                        "quantidadeEscolasTotal": 1,
                        "quantidadeAlunosTotal": 342,
                        "escolas": [
                            {
                                "id": "f4850523-537c-44ab-a7c7-a0e7c40c1aeb",
                                "ups": 233,
                                "nome": "EEB NORMELIO CUNHA",
                                "uf": "SC",
                                "quantidadeAlunos": 342,
                                "distanciaPolo": 188.47160437789148
                            }
                        ],
                        "detalhesPorUF": [
                            {
                                "uf": "SC",
                                "quantidadeEscolasTotal": 1
                            }
                        ]
                    }
                ],
                "id": "e54dc3c6-d3b4-4da8-a8eb-3744c7017bb6",
                "nome": "Planejamento Ca",
                "responsavel": "tester@gmail.com",
                "mesInicio": 2,
                "mesFim": 4,
                "anoInicio": "2023",
                "anoFim": "2024",
                "quantidadeAcoes": 4
            },
        ]
}

export const escolasFiltradasResponse: EscolasFiltradasResponse = {
    escolasPorPagina: 1000,
    totalEscolas: 3,
    totalPaginas: 1,
    escolas: [
        {
            idEscola: 1,
            codigoEscola: 123,
            nomeEscola: 'Escola A',
            idRede: 1,
            descricaoRede: 'Rede A',
            cep: '12345-678',
            idUf: 2,
            siglaUf: 'SP',
            endereco: 'Rua A, 123',
            idMunicipio: 456,
            nomeMunicipio: 'Município A',
            idLocalizacao: 3,
            descricaoLocalizacao: 'Localização A',
            longitude: '-45.6789',
            latitude: '-23.4567',
            idEtapasDeEnsino: 4,
            etapaEnsino: {},
            numeroTotalDeAlunos: 200,
            idSituacao: 5,
            descricaoSituacao: 'Ativa',
            idPorte: 6,
            descricaoPorte: 'Médio',
            telefone: '987654321',
            numeroTotalDeDocentes: 20,
            observacao: 'Observações da Escola A',
            distanciaPolo: 10.5,
            poloId: 789,
        },
        {
            idEscola: 2,
            codigoEscola: 456,
            nomeEscola: 'Escola B',
            idRede: 2,
            descricaoRede: 'Rede B',
            cep: '54321-876',
            idUf: 1,
            siglaUf: 'RJ',
            endereco: 'Av. B, 456',
            idMunicipio: 789,
            nomeMunicipio: 'Município B',
            idLocalizacao: 1,
            descricaoLocalizacao: 'Localização B',
            longitude: '-40.1234',
            latitude: '-22.3456',
            idEtapasDeEnsino: 3,
            etapaEnsino: {},
            numeroTotalDeAlunos: 150,
            idSituacao: 4,
            descricaoSituacao: 'Inativa',
            idPorte: 5,
            descricaoPorte: 'Pequeno',
            telefone: '123456789',
            numeroTotalDeDocentes: 15,
            observacao: 'Observações da Escola B',
            distanciaPolo: 8.2,
            poloId: 987,
          },
          {
            idEscola: 3,
            codigoEscola: 789,
            nomeEscola: 'Escola C',
            idRede: 3,
            descricaoRede: 'Rede C',
            cep: '98765-432',
            idUf: 3,
            siglaUf: 'MG',
            endereco: 'Praça C, 789',
            idMunicipio: 123,
            nomeMunicipio: 'Município C',
            idLocalizacao: 2,
            descricaoLocalizacao: 'Localização C',
            longitude: '-42.5678',
            latitude: '-20.1234',
            idEtapasDeEnsino: 5,
            etapaEnsino: {},
            numeroTotalDeAlunos: 180,
            idSituacao: 6,
            descricaoSituacao: 'Ativa',
            idPorte: 4,
            descricaoPorte: 'Grande',
            telefone: '987123456',
            numeroTotalDeDocentes: 18,
            observacao: 'Observações da Escola C',
            distanciaPolo: 12.3,
            poloId: 654,
          }
    ]
}