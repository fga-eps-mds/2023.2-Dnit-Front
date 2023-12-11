import { rest } from "msw";
import { ObterPorte, adicionarFator, deletarFator, editarCustosLogisticos, editarFator, listarFatores, obterCustosLogisticos } from "../../../consts/service"
import { parametrosCustoLogistico } from "../../stub/priorizacaoModelos"
import { fatoresPriorizacao } from "../../stub/priorizacaoModelos"

const obterCustosLogisticosRequest = rest.get(
    `${obterCustosLogisticos}`,
    (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(parametrosCustoLogistico)
        )
    }
)

const obterFatoresPriorizacaoRequest = rest.get(
    `${listarFatores}`,
    (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(fatoresPriorizacao)
        )
    }
)

const obterFatorPriorizacaoRequest = rest.get(
    `${listarFatores}/:id`,
    (req, res, ctx) => {
        const { id } = req.params
        let fator = {
            ...fatoresPriorizacao[0],
            id: id
        }
        console.log(fator)
        return res(
            ctx.status(200),
            ctx.json(fator)
        )
    }
)

const adicionarFatorPriorizacaoRequest = rest.post(
    adicionarFator, 
    (_req, res, ctx) => res(ctx.status(200))
)

const deleteFatorPriorizacaoRequest = rest.delete(
    `${deletarFator}*`,
    (_req, res, ctx) => res(ctx.status(200))
)

const editarFatorPriorizacaoRequest = rest.put(
    `${editarFator}/:id`,
    (_req, res, ctx) => {
        const { id } = _req.params
        let fator = {
            ...fatoresPriorizacao[0],
            id: id
        }
        console.log(fator)
        return res(
            ctx.status(200),
            ctx.json(fator)
        )
    }
)

const editarCustosLogisticosRequest = rest.put(
    `${editarCustosLogisticos}`,
    (_req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(parametrosCustoLogistico)
        )
    }
)

const obterPortes = rest.get(
    `${ObterPorte}`,
    (_req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                  "id": "Ate50",
                  "descricao": "Até 50 matrículas de escolarização"
                },
                {
                  "id": "Entre201e500",
                  "descricao": "Entre 201 e 500 matrículas de escolarização"
                },
                {
                  "id": "Entre501e1000",
                  "descricao": "Entre 501 e 1000 matrículas de escolarização"
                },
                {
                  "id": "Entre51e200",
                  "descricao": "Entre 51 e 200 matrículas de escolarização"
                },
                {
                  "id": "Mais1000",
                  "descricao": "Mais de 1000 matrículas de escolarização"
                }]
            )
        )
    }
)

const priorizacaoRequests = [
    obterCustosLogisticosRequest,
    obterFatoresPriorizacaoRequest,
    obterFatorPriorizacaoRequest,
    adicionarFatorPriorizacaoRequest,
    deleteFatorPriorizacaoRequest,
    editarCustosLogisticosRequest,
    editarFatorPriorizacaoRequest,
    obterPortes
]

export default priorizacaoRequests