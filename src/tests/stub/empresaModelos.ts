import { EmpresaModel } from "../../models/empresa";

export const empresas: EmpresaModel[] = [
    {
        cnpj: "74953570000132",
        razaoSocial: "Empresa A",
        uFs: [
            {
                id: 27,
                nome: "Distrito Federal",
                sigla: "DF"
            }
        ]
    },
    {
        cnpj: "10120718000175",
        razaoSocial: "Empresa B",
        uFs: [
            {
                id: 27,
                nome: "Distrito Federal",
                sigla: "DF"
            },
            {
                id: 24,
                nome: "São Paulo",
                sigla: "SP"
            }
        ]
    }
]