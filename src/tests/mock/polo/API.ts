import { rest } from "msw";
import { poloUrl, polosFiltradosUrl } from "../../../consts/service";
import { polos } from "../../stub/poloModelos";

const listarPolosRequest = rest.get(
    `${polosFiltradosUrl}`,
    (req, res, ctx) => {
        const filtroNome = req.url.searchParams.get("nome")
        if (filtroNome === "" || !filtroNome) {
            return res(
                ctx.status(200),
                ctx.json({
                    "pagina": 1,
                    "itemsPorPagina": 3,
                    "total": 3,
                    "totalPaginas": 1,
                    "items": polos
                })
            )
        }
        else {
            return res(ctx.status(500))
        }
    }
)

const cadastrarPoloRequest = rest.post(
    poloUrl, 
    (_req, res, ctx) => res(ctx.status(200))
);

const obterPoloRequest = rest.get(
    `${poloUrl}/:id`,
    (req, res, ctx) => {
        const { id } = req.params
        let polo = {
            ...polos[0],
            id: id
        }
        console.log(polo)
        return res(
            ctx.status(200),
            ctx.json(polo)
        )
    }
)

const deletarPoloRequest = rest.delete(
    `${poloUrl}*`,
    (_req, res, ctx) => res(ctx.status(200))
);

const editarPoloRequest = rest.put(
    `${poloUrl}/:id`,
    (_req, res, ctx) => {
        const { id } = _req.params
        let polo = {
            ...polos[0],
            id: id
        }
        console.log(polo)
        return res(
            ctx.status(200),
            ctx.json(polo)
        )
    }
)


const poloRequests = [
    listarPolosRequest, 
    cadastrarPoloRequest,
    obterPoloRequest, 
    deletarPoloRequest, 
    editarPoloRequest,
]

export default poloRequests