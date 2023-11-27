import { rest } from "msw";
import { listarEmpresasUrl, cadastrarEmpresaUrl, excluirEmpresaUrl, editarEmpresaUrl, listarUsuariosEmpresaUrl, visualizarEmpresaUrl, adicionarUsuarioEmpresaUrl, removerUsuarioEmpresaUrl } from "../../../consts/service";
import { empresas } from "../../stub/empresaModelos";
import { usuarios } from "../../stub/usuarioModelos";

const listarEmpresasRequest = rest.get(
    `${listarEmpresasUrl}`,
    (req, res, ctx) => {
        const filtroNome = req.url.searchParams.get("nome")
        if (filtroNome === "" || !filtroNome) {
            return res(
                ctx.status(200),
                ctx.json({
                    "pagina": 1,
                    "itemsPorPagina": 2,
                    "total": 2,
                    "totalPaginas": 1,
                    "items": empresas
                })
            )
        }
        else {
            return res(ctx.status(500))
        }
    }
)

const cadastrarEmpresaRequest = rest.post(
    cadastrarEmpresaUrl, 
    (_req, res, ctx) => res(ctx.status(200))
);

const obterEmpresaRequest = rest.get(
    `${visualizarEmpresaUrl}/:cnpj`,
    (req, res, ctx) => {
        const { cnpj } = req.params
        let empresa = {
            ...empresas[0],
            cnpj: cnpj
        }
        console.log(empresa)
        return res(
            ctx.status(200),
            ctx.json(empresa)
        )
    }
)

const deletarEmpresaRequest = rest.delete(
    `${excluirEmpresaUrl}*`,
    (_req, res, ctx) => res(ctx.status(200))
);

const editarEmpresaRequest = rest.put(
    `${editarEmpresaUrl}/:cnpj`,
    (_req, res, ctx) => {
        const { cnpj } = _req.params
        let empresa = {
            ...empresas[0],
            cnpj: cnpj
        }
        console.log(empresa)
        return res(
            ctx.status(200),
            ctx.json(empresa)
        )
    }
)

const listarUsuariosEmpresa = rest.get(
    `${listarUsuariosEmpresaUrl}/:cnpj`,
    (_req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "pagina": 1,
                    "itemsPorPagina": 2,
                    "total": 2,
                    "totalPaginas": 1,
                    "items": [usuarios[0], usuarios[1]]
                }
            )
        )
    }
)

const adicionarUsuarioEmpresaRequest = rest.post(
    adicionarUsuarioEmpresaUrl,
    (_req, res, ctx) => {
        return res(
            ctx.status(200)
        )
    }
)

const removerUsuarioEmpresaRequest = rest.delete(
    removerUsuarioEmpresaUrl,
    (_req, res, ctx) => {
        return res(
            ctx.status(200)
        )
    }
)

const empresaRequests = [
    listarEmpresasRequest, 
    cadastrarEmpresaRequest,
    obterEmpresaRequest, 
    deletarEmpresaRequest, 
    editarEmpresaRequest,
    listarUsuariosEmpresa,
    adicionarUsuarioEmpresaRequest,
    removerUsuarioEmpresaRequest
]

export default empresaRequests