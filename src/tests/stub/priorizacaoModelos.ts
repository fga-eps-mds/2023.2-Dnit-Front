import { CustoLogisticoModel } from "../../models/prioridade";
import { FatorModel } from "../../models/prioridade";

export const parametrosCustoLogistico: CustoLogisticoModel[] = [
    {
      custo: 1,
      raioMin: 0,
      raioMax: 250,
      valor: 0
    },
    {
        custo: 2,
        raioMin: 250,
        raioMax: 500,
        valor: 0
      },
      {
        custo: 3,
        raioMin: 500,
        raioMax: 1000,
        valor: 0
      },
      {
        custo: 4,
        raioMin: 1000,
        raioMax: null,
        valor: 0
      }
]

export const fatoresPriorizacao: FatorModel[] = [
    {
        nome: "UPS",
        peso: 100,
        ativo: true,
        primario: true,
        fatorCondicoes: []
      },
      {
        nome: "Custo Logistico",
        peso: 80,
        ativo: true,
        primario: true,
        fatorCondicoes: []
      },
      {
        nome: "Fator A",
        peso: 0,
        ativo: true,
        primario: false,
        fatorCondicoes: [
          {
            propriedade: "4",
            operador: "1",
            valores: [
              "27"
            ],
          }
        ]
      },
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        nome: "Fator B",
        peso: 0,
        ativo: true,
        primario: false,
        fatorCondicoes: [
          {
            id: "d65d0e67-83ca-4c40-92ff-04220ab1bf18",
            propriedade: "4",
            operador: "1",
            valores: [
              "27"
            ],
            fatorPriorizacaoId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      }
]