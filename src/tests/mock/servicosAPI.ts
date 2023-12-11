import { rest } from "msw";
import { setupServer } from "msw/node";
import {
    atualizarDescricaoRanque,
    atualizarTipoPerfil,
    atualizarTokenUrl,
    cadastrarPerfilUrl,
    excluiPerfil,
    listarEscolasRanque,
    listarRanques,
    listarPerfis,
    listarPermissoesCategoria,
    listarUsuarioPermissoes,
    listarUsuarios,
    municipioURL,
    obterPerfil,
    ranqueamentoProcessamento,
    unidadesFederativasURL,
    urlAPIEscolas,
    urlAPIUps
} from "../../consts/service";
import poloRequests from "./polo/API";
import empresaRequests from "./empresa/API";
import { Permissao, TipoPerfil } from "../../models/auth";
import { usuarios } from "../stub/usuarioModelos";
import { ranqueData } from "../stub/ranqueModelos";
import { solicitacao, solicitacaoSemEscola } from "../stub/solicitacaoAcao";
import priorizacaoRequests from "./priorizacao/API";

const escolasService = urlAPIEscolas;
const upsService = urlAPIUps;

const server = setupServer(
  rest.get(
    listarUsuarioPermissoes,
    (_, res, ctx) => res(ctx.json(Object.values(Permissao))),
  ),
  rest.post(
    atualizarTokenUrl,
    (_, res, ctx) => res(
      ctx.json({ token: "token", tokenAtualizacao: "token atualizacao", expiraEm: new Date().toISOString(), permissoes: [Permissao.EscolaCadastrar] })),
  ),
  rest.get(
    `${escolasService}/escolas/obter`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          pagina: 1,
          escolasPorPagina: 5,
          totalEscolas: 29,
          totalPaginas: 6,
          escolas: [
            {
              idEscola: 227,
              codigoEscola: 41127226,
              nomeEscola: "Escola A",
              idRede: 1,
              cep: "82860130",
              idUf: 1,
              descricaoUf: "Acre",
              endereco:
                "RUA JOAO BATISTA SCUCATO, 80 ATUBA. 82860-130 Curitiba - PR.",
              idMunicipio: 5200050,
              nomeMunicipio: "Abadia de Goiás",
              idLocalizacao: 1,
              longitude: "-49,2011",
              latitude: "-25,38443",
              etapaEnsino: {},
              numeroTotalDeAlunos: 200,
              idSituacao: 1,
              descricaoSituacao: "Escola Crítica",
              idPorte: 1,
              telefone: "32562393",
              numeroTotalDeDocentes: 200,
              siglaUf: "AC",
            },
            {
              idEscola: 224,
              codigoEscola: 41127226,
              nomeEscola: "ANISIO TEIXEIRA E M EF",
              idRede: 1,
              cep: "82860130",
              idUf: 1,
              descricaoUf: "Acre",
              endereco:
                "RUA JOAO BATISTA SCUCATO, 80 ATUBA. 82860-130 Curitiba - PR.",
              idMunicipio: 5200050,
              nomeMunicipio: "Abadia de Goiás",
              idLocalizacao: 1,
              longitude: "-49,2011",
              latitude: "-25,38443",
              etapaEnsino: {
                "4": "Educação de Jovens Adultos",
                "5": "Educação Profissional",
              },
              numeroTotalDeAlunos: 200,
              idSituacao: 1,
              descricaoSituacao: "Escola Crítica",
              idPorte: 1,
              telefone: "32562393",
              numeroTotalDeDocentes: 200,
              siglaUf: "AC",
            },
            {
              idEscola: 225,
              codigoEscola: 11116,
              nomeEscola: "ANTAO LEANDRO BITU EEF",
              idRede: 1,
              cep: "CEP007",
              idUf: 2,
              descricaoUf: "Alagoas",
              endereco: "Endereço E",
              idMunicipio: 5200050,
              nomeMunicipio: "Abadia de Goiás",
              idLocalizacao: 1,
              longitude: "56",
              latitude: "-25,38443",
              etapaEnsino: {},
              numeroTotalDeAlunos: 140,
              idSituacao: 4,
              descricaoSituacao: "Escola Crítica",
              idPorte: 2,
              telefone: "40028922",
              numeroTotalDeDocentes: 16,
              siglaUf: "AL",
            },
          ],
        })
      );
    }
  ),
  rest.get(
    `${escolasService}/dominio/unidadeFederativa`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            nome: "Acre",
            id: 1,
            sigla: "AC",
          },
          {
            nome: "Alagoas",
            id: 2,
            sigla: "AL",
          },
          {
            nome: "Amapá",
            id: 3,
            sigla: "AP",
          },
          {
            nome: "Amazonas",
            id: 4,
            sigla: "AM",
          },
          {
            nome: "Bahia",
            id: 5,
            sigla: "BA",
          },
          {
            nome: "Ceará",
            id: 6,
            sigla: "CE",
          },
          {
            nome: "Distrito Federal",
            id: 27,
            sigla: "DF",
          },
          {
            nome: "Espírito Santo",
            id: 7,
            sigla: "ES",
          },
          {
            nome: "Goiás",
            id: 8,
            sigla: "GO",
          },
          {
            nome: "Maranhão",
            id: 9,
            sigla: "MA",
          },
          {
            nome: "Mato Grosso",
            id: 10,
            sigla: "MT",
          },
          {
            nome: "Mato Grosso do Sul",
            id: 11,
            sigla: "MS",
          },
          {
            nome: "Minas Gerais",
            id: 12,
            sigla: "MG",
          },
          {
            nome: "Pará",
            id: 13,
            sigla: "PA",
          },
          {
            nome: "Paraíba",
            id: 14,
            sigla: "PB",
          },
          {
            nome: "Paraná",
            id: 15,
            sigla: "PR",
          },
          {
            nome: "Pernambuco",
            id: 16,
            sigla: "PE",
          },
          {
            nome: "Piauí",
            id: 17,
            sigla: "PI",
          },
          {
            nome: "Rio de Janeiro",
            id: 18,
            sigla: "RJ",
          },
          {
            nome: "Rio Grande do Norte",
            id: 19,
            sigla: "RN",
          },
          {
            nome: "Rio Grande do Sul",
            id: 20,
            sigla: "RS",
          },
          {
            nome: "Rondônia",
            id: 21,
            sigla: "RO",
          },
          {
            nome: "Roraima",
            id: 22,
            sigla: "RR",
          },
          {
            nome: "Santa Catarina",
            id: 23,
            sigla: "SC",
          },
          {
            nome: "São Paulo",
            id: 24,
            sigla: "SP",
          },
          {
            nome: "Sergipe",
            id: 25,
            sigla: "SE",
          },
          {
            nome: "Tocantins",
            id: 26,
            sigla: "TO",
          },
        ])
      );
    }
  ),
  rest.get(
    `${escolasService}/dominio/situacao`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 4,
            descricao: "Escola Crítica",
          },
          {
            id: 1,
            descricao: "Indicação",
          },
          {
            id: 3,
            descricao: "Jornada de crescimento do professor",
          },
          {
            id: 2,
            descricao: "Solicitação da escola",
          },
        ])
      );
    }
  ),
  rest.get(
    `${escolasService}/dominio/etapasDeEnsino`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 4,
            descricao: "Educação de Jovens Adultos",
          },
          {
            id: 1,
            descricao: "Educação Infantil",
          },
          {
            id: 5,
            descricao: "Educação Profissional",
          },
          {
            id: 2,
            descricao: "Ensino Fundamental",
          },
          {
            id: 3,
            descricao: "Ensino Médio",
          },
        ])
      );
    }
  ),
  rest.get(
    `${escolasService}/dominio/propriedades`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            rotulo: "Porte"
          },
          {
            id: 2,
            rotulo: "Situacao"
          },
          {
            id: 3,
            rotulo: "Municipio"
          },
          {
            id: 4,
            rotulo: "UF"
          },
          {
            id: 5,
            rotulo: "Localizacao"
          },
          {
            id: 6,
            rotulo: "TotalAlunos"
          },
          {
            id: 7,
            rotulo: "EtapaEnsino"
          },
          {
            id: 8,
            rotulo: "Rede"
          }
        ])
      );
    }
  ),
  rest.get(
    `${escolasService}/dominio/propriedades`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: "Ate50",
            descricao: "Até 50 matrículas de escolarização"
          },
          {
            id: "Entre201e500",
            descricao: "Entre 201 e 500 matrículas de escolarização"
          },
          {
            id: "Entre501e1000",
            "descricao": "Entre 501 e 1000 matrículas de escolarização"
          },
          {
            id: "Entre51e200",
            descricao: "Entre 51 e 200 matrículas de escolarização"
          },
          {
            id: "Mais1000",
            descricao: "Mais de 1000 matrículas de escolarização"
          }
        ])
      );
    }
  ),
  rest.delete(
    `${escolasService}/escolas/excluir`,
    (req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(`${escolasService}/dominio/municipio`, (req, res, ctx) => {
    const ufId = req.url.searchParams.get('idUf');
    if (ufId === '27') {
      return res(ctx.status(200), ctx.json([
        {
          nome: "Brasília",
          id: 5300108,
        },
      ]));
    }
    if (ufId === '18') {
      return res(ctx.status(200), ctx.json([
        {
          nome: "Angra dos Reis",
          id: 3300100,
        },
        {
          nome: "Aperibé",
          id: 3300159,
        },
        {
          nome: "Araruama",
          id: 3300209,
        },
        {
          nome: "Areal",
          id: 3300225,
        },
        {
          nome: "Armação dos Búzios",
          id: 3300233,
        },
      ]));
    }
  }),
  rest.get(
    `${escolasService}/dominio/municipio`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            nome: "Acrelândia",
            id: 1200013,
          },
          {
            nome: "Assis Brasil",
            id: 1200054,
          },
          {
            nome: "Brasiléia",
            id: 1200104,
          },
          {
            nome: "Bujari",
            id: 1200138,
          },
          {
            nome: "Caririaçu",
            id: 1200179,
          },
          {
            nome: "Cruzeiro do Sul",
            id: 1200203,
          },
          {
            nome: "Epitaciolândia",
            id: 1200252,
          },
          {
            nome: "Feijó",
            id: 1200302,
          },
          {
            nome: "Jordão",
            id: 1200328,
          },
          {
            nome: "Mâncio Lima",
            id: 1200336,
          },
          {
            nome: "Manoel Urbano",
            id: 1200344,
          },
          {
            nome: "Marechal Thaumaturgo",
            id: 1200351,
          },
          {
            nome: "Plácido de Castro",
            id: 1200385,
          },
          {
            nome: "Porto Acre",
            id: 1200807,
          },
          {
            nome: "Rio Branco",
            id: 1200401,
          },
          {
            nome: "Rodrigues Alves",
            id: 1200427,
          },
          {
            nome: "Santa Rosa do Purus",
            id: 1200435,
          },
          {
            nome: "Senador Guiomard",
            id: 1200450,
          },
          {
            nome: "Sena Madureira",
            id: 1200500,
          },
          {
            nome: "Tarauacá",
            id: 1200609,
          },
          {
            nome: "Xapuri",
            id: 1200708,
          },
        ])
      );
    }
  ),
  rest.post(
    `${escolasService}/escolas/removerSituacao`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.post(
    `${escolasService}/escolas/cadastrarEscola`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.post(
    `${escolasService}/escolas/cadastrarEscolaPlanilha`,
    (req, res, ctx) => {
      return res(ctx.json([2, 3]));
    }
  ),
  rest.post(
    `${upsService}/rodovia/cadastrarRodoviaPlanilha`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get("https://viacep.com.br/ws/12345678/json", (req, res, ctx) => {
    return res(
      ctx.json({
        cep: "12345-678",
        logradouro: "SHA Conjunto Chácara",
        complemento: "",
        bairro: "Setor Habitacional Arniqueira (Águas Claras)",
        localidade: "Brasília",
        uf: "DF",
        ibge: "5300108",
        gia: "",
        ddd: "61",
        siafi: "9701",
      })
    );
  }),
  rest.put(
    `${escolasService}/escolas/alterarDadosEscola`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    `${escolasService}/solicitacaoAcao/escolas`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            cod: 12008966,
            estado: "AC",
            nome: "ESC ALTINA MAGALHAES DA SILVA",
          },
          {
            cod: 12023582,
            estado: "AC",
            nome: "ESC BOM JESUS",
          },
          {
            cod: 12020613,
            estado: "AC",
            nome: "ESC BRANCA DE NEVE",
          },
          {
            cod: 12023590,
            estado: "AC",
            nome: "ESC CASTRO ALVES",
          },
          {
            cod: 12009067,
            estado: "AC",
            nome: "ESC DUQUE DE CAXIAS",
          },
          {
            cod: 12128236,
            estado: "AC",
            nome: "ESC FAMILIA AGRICOLA JEAN PIERRE MINGAN",
          },
          {
            cod: 12028061,
            estado: "AC",
            nome: "ESC FRANCISCO PEREIRA DE SOUZA",
          },
          {
            cod: 12009091,
            estado: "AC",
            nome: "ESC INTEGRACAO",
          },
          {
            cod: 12023574,
            estado: "AC",
            nome: "ESC JAIME DE ALENCAR",
          },
          {
            cod: 12009156,
            estado: "AC",
            nome: "ESC JOSE PLACIDO DE CASTRO",
          },
          {
            cod: 12028312,
            estado: "AC",
            nome: "ESC JOSE RODRIGUES CASSIMIRO",
          },
          {
            cod: 12021768,
            estado: "AC",
            nome: "ESC MARCILIO PONTES DOS SANTOS",
          },
          {
            cod: 12018376,
            estado: "AC",
            nome: "ESC MARECHAL RONDON",
          },
          {
            cod: 12009164,
            estado: "AC",
            nome: "ESC MARIA DE JESUS RIBEIRO",
          },
          {
            cod: 12009172,
            estado: "AC",
            nome: "ESC MONTEIRO LOBATO",
          },
          {
            cod: 12023531,
            estado: "AC",
            nome: "ESC NOVO HORIZONTE",
          },
          {
            cod: 12018384,
            estado: "AC",
            nome: "ESC OLAVO BILAC",
          },
          {
            cod: 12023566,
            estado: "AC",
            nome: "ESC PARAISO",
          },
          {
            cod: 12009229,
            estado: "AC",
            nome: "ESC PROF PEDRO DE CASTRO MEIRELES",
          },
          {
            cod: 12048224,
            estado: "AC",
            nome: "ESC RITA BOCALOM",
          },
          {
            cod: 12018422,
            estado: "AC",
            nome: "ESC SANTA LUCIA III",
          },
          {
            cod: 12022810,
            estado: "AC",
            nome: "ESC SAO LUCAS",
          },
          {
            cod: 12009296,
            estado: "AC",
            nome: "ESC SAO PEDRO",
          },
          {
            cod: 12037621,
            estado: "AC",
            nome: "MARIA DE JESUS RIBEIRO",
          },
        ])
      );
    }
  ),
  rest.post(
    `${escolasService}/solicitacaoAcao`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    `${upsService}/calcular/ups/escola`,
    (req, res, ctx) => {
      return res(
        ctx.delay(1000),
        ctx.json({
          upsGeral: 123,
          ups2018: 456,
          ups2019: 789,
          ups2020: 1011,
          ups2021: 1213,
          ups2022: 1415,
        })
      );
    }
  ),
  rest.delete(
    `${excluiPerfil}/1`,
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.json('Perfil excluido')
      );
    }
  ),
  rest.delete(
    `${excluiPerfil}/erro`,
    (req, res, ctx) => {
      return res(ctx.status(400));
    }
  ),
  rest.get(
    `${listarPermissoesCategoria}`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([
        {
          categoria: 'Escola',
          permissoes: [Permissao.EscolaCadastrar, Permissao.EscolaEditar, Permissao.EscolaRemover],
        },
        {
          categoria: 'Ups',
          permissoes: [Permissao.UpsCalcularEscola, Permissao.UpsCalcularSinistro],
        }
      ]));
    }
  ),
  rest.post(
    `${cadastrarPerfilUrl}`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ 'id': '1' }));
    }
  ),
  rest.get(
    `${obterPerfil}/erro`,
    (req, res, ctx) => { return res(ctx.status(404)) }
  ),
  rest.get(
    `${obterPerfil}/1`,
    (req, res, ctx) => {
      return res(ctx.status(200),
        ctx.json({
          id: '1',
          nome: 'perfil-teste',
          quantidadeUsuarios: 1,
          tipo: TipoPerfil.Customizavel,
          permissoes: [Permissao.EscolaCadastrar],
          categoriasPermissao: [
            {
              categoria: 'Escola',
              permissoes: [Permissao.EscolaCadastrar],
            },
            {
              categoria: 'Ups',
              permissoes: [],
            }
          ]
        }));
    }
  ),
  rest.put(
    `${obterPerfil}/1`,
    (req, res, ctx) => {
      return res(ctx.status(200),
        ctx.json({
          id: '1',
          nome: 'perfil-teste',
          quantidadeUsuarios: 1,
          tipo: TipoPerfil.Customizavel,
          permissoes: [Permissao.EscolaCadastrar],
          categoriasPermissao: [
            {
              categoria: 'Escola',
              permissoes: [Permissao.EscolaCadastrar],
            },
            {
              categoria: 'Ups',
              permissoes: [],
            }
          ]
        }));
    }
  ),
  rest.get(listarUsuarioPermissoes,
    (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
  rest.get(listarPerfis,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json([
          {
            id: '1',
            nome: 'Administrador',
            quantidadeUsuarios: 1,
            tipo: TipoPerfil.Administrador,
            permissoes: [Permissao.EscolaCadastrar, Permissao.EscolaEditar, Permissao.EscolaRemover, Permissao.UpsCalcularEscola, Permissao.UpsCalcularSinistro],
            categoriasPermissao: [
              {
                categoria: 'Escola',
                permissoes: [Permissao.EscolaCadastrar, Permissao.EscolaEditar, Permissao.EscolaRemover],
              },
              {
                categoria: 'Ups',
                permissoes: [Permissao.UpsCalcularEscola, Permissao.UpsCalcularSinistro],
              }
            ]
          },
          {
            id: '2',
            nome: 'Básico',
            quantidadeUsuarios: 1,
            tipo: TipoPerfil.Basico,
            permissoes: [Permissao.EscolaCadastrar],
            categoriasPermissao: [
              {
                categoria: 'Escola',
                permissoes: [Permissao.EscolaCadastrar],
              },
              {
                categoria: 'Ups',
                permissoes: [],
              }
            ]
          },
          {
            id: '3',
            nome: 'Custom',
            quantidadeUsuarios: 1,
            tipo: TipoPerfil.Customizavel,
            permissoes: [Permissao.EscolaCadastrar],
            categoriasPermissao: [
              {
                categoria: 'Escola',
                permissoes: [Permissao.EscolaCadastrar],
              },
              {
                categoria: 'Ups',
                permissoes: [],
              }
            ]
          }
        ]),
      )
  ),
  rest.patch(`${atualizarTipoPerfil}/0/perfil`,
    (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
  rest.patch(`${atualizarTipoPerfil}/1/perfil`,
    (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
  rest.patch(`${atualizarTipoPerfil}/2/perfil`,
    (req, res, ctx) => res(ctx.status(400), ctx.body("erro"))),
  // rest.get('https://localhost:7083/api/usuario?pagina=1&itemsPorPagina=10',
  rest.get(`${listarUsuarios}*`, (req, res, ctx) => res(ctx.status(200), ctx.json(
    {
      "pagina": 1,
      "itemsPorPagina": 10,
      "total": 3,
      "totalPaginas": 1,
      "items": usuarios
    }
  ))),
  ...poloRequests,
  ...empresaRequests,
  ...priorizacaoRequests,
  rest.get(listarEscolasRanque, (_, res, ctx) => res(
    ctx.status(200),
    ctx.json(ranqueData)
  )),
  rest.get(ranqueamentoProcessamento, (_, res, ctx) => res(
    ctx.json({
      id: 1,
      emProgresso: false,
      dataInicio: "2023-11-19T12:58:05.053016+00:00",
      dataFim: "2023-11-19T12:59:16.556424+00:00"
    })
  )),
  rest.get(unidadesFederativasURL, (_, res, ctx) => res(
    ctx.json([
      {
        id: 1,
        nome: 'Distrito Federal',
        sigla: 'DF',
      },
      {
        id: 2,
        nome: 'Goiás',
        sigla: 'GO',
      }
    ])
  )),
  rest.get(municipioURL, (_, res, ctx) => res(
    ctx.json([
      {
        id: 1,
        nome: 'municipio 1',
      },
      {
        id: 2,
        nome: 'municipio 2',
      }
    ])
  )),
  rest.get(`${listarEscolasRanque}/1`, (_, res, ctx) => res(ctx.json({
    ranqueInfo: {
      ranqueId: 1,
      pontuacao: 1000,
      posicao: 1,
      fatores: [
        {
          nome: "UPS",
          peso: 1,
          valor: 1454
        }
      ],
    },
    id: '1',
    codigo: '123',
    nome: 'escola teste',
    cep: '72844654',
    endereco: 'endereco',
    longitude: '1.0',
    latitude: '1.0',
    totalDocentes: 10,
    totalAlunos: 10,
    telefone: '40028922',
    uf: {
      id: 1,
      sigla: 'DF',
      nome: 'Distrito Federal'
    },
    municipio: {
      id: 1,
      nome: 'municipio'
    },
    rede: {
      id: 'Municipal',
      nome: 'Municipal',
    },
    porte: {
      id: 'Entre51e200',
      descricao: 'Entre 51 e 200 matrículas de escolarização'
    },
    localizacao: {
      id: 'Urbana',
      descricao: 'Urbana'
    },
    situacao: {
      id: 'Critica',
      descricao: 'Critica',
    },
    etapasEnsino: [
      {
        id: '1',
        descricao: 'etapa'
      },
      {
        id: '2',
        descricao: 'etapa 2'
      }
    ],
    temSolicitacao: true,
  }))),

  rest.delete(`${urlAPIEscolas}/planejamento/1`, (req, res, ctx) => res(ctx.status(200), ctx.json(
        {
            id: "1"
        }
    ))),

  rest.delete(`${urlAPIEscolas}/planejamento/2`, (req, res, ctx) => res(ctx.status(400), ctx.json(
        {
            id: "2"
        }
    ))),
    
  rest.get(`${listarEscolasRanque}/id-4`, (_, res, ctx) => res(ctx.json({
    ranqueInfo: {
      ranqueId: 1,
      pontuacao: 1000,
      posicao: 1,
      fatores: [
        {
          nome: "UPS",
          peso: 1,
          valor: 1454
        }
      ],
    },
    id: '1',
    codigo: '123',
    nome: 'escola teste',
    cep: '72844654',
    endereco: 'endereco',
    longitude: '9,0893',
    latitude: '-15,0987',
    totalDocentes: 10,
    totalAlunos: 10,
    telefone: '40028922',
    uf: {
      id: 1,
      sigla: 'DF',
      nome: 'Distrito Federal'
    },
    municipio: {
      id: 1,
      nome: 'municipio'
    },
    rede: {
      id: 'Municipal',
      nome: 'Municipal',
    },
    porte: {
      id: 'Entre51e200',
      descricao: 'Entre 51 e 200 matrículas de escolarização'
    },
    localizacao: {
      id: 'Urbana',
      descricao: 'Urbana'
    },
    situacao: {
      id: 'Critica',
      descricao: 'Critica',
    },
    etapasEnsino: [
      {
        id: '1',
        descricao: 'etapa'
      },
      {
        id: '2',
        descricao: 'etapa 2'
      }
    ],
    temSolicitacao: true,
  }))),
  rest.get(`${listarEscolasRanque}/id-3`,
    (req, res, ctx) => res(ctx.status(400), ctx.body("erro"))),
  rest.get(`${listarEscolasRanque}/2`, (_, res, ctx) => res(ctx.json({
    ranqueInfo: {
      ranqueId: 2,
      pontuacao: 1000,
      posicao: 2,
      fatores: [
        {
          nome: "UPS",
          peso: 1,
          valor: 1454
        }
      ],
    },
    id: '2',
    codigo: '123',
    nome: 'escola teste',
    cep: '72844654',
    endereco: 'endereco',
    longitude: '1.0',
    latitude: '1.0',
    totalDocentes: 10,
    totalAlunos: 10,
    telefone: '40028922',
    uf: {
      id: 1,
      sigla: 'DF',
      nome: 'Distrito Federal'
    },
    municipio: {
      id: 1,
      nome: 'municipio'
    },
    rede: {
      id: 'Municipal',
      nome: 'Municipal',
    },
    porte: {},
    localizacao: {
      id: 'Urbana',
      descricao: 'Urbana'
    },
    situacao: {},
    etapasEnsino: [],
    temSolicitacao: false,
  }))),
  rest.post(
    `${escolasService}/solicitacaoAcao`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),
  rest.get(
    `${escolasService}/solicitacaoAcao`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
        {
          "pagina": 1,
          "itemsPorPagina": 10,
          "total": 2,
          "totalPaginas": 1,
          "items": [solicitacao, solicitacaoSemEscola]
        }
      ))
    }
  ),
  rest.put(
    `${atualizarDescricaoRanque}/1`,
    (req, res, ctx) => res(ctx.status(200))
  ),
  rest.get(
    listarRanques,
    (req, res, ctx) => res(
      ctx.status(200),
      ctx.json({
        "pagina": 1,
        "itemsPorPagina": 10,
        "total": 2,
        "totalPaginas": 1,
        "items": [
            {
                "id": 1,
                "numEscolas": 7777,
                "data": "2023-11-22T13:49:28.28035+00:00",
                "descricao": null,
                "fatores": [
                    {
                        "nome": "UPS",
                        "peso": 1,
                        "valor": 0
                    }
                ]
            },
            {
                "id": 2,
                "numEscolas": 8888,
                "data": "2023-11-22T13:22:03.937386+00:00",
                "descricao": "asasas",
                "fatores": [
                    {
                        "nome": "UPS",
                        "peso": 1,
                        "valor": 0
                    }
                ]
            },
        ]
    })
    )
  )
);

export default server;
