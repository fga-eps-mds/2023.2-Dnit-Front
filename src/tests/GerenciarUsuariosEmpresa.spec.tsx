/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { render, waitFor, act, fireEvent } from "@testing-library/react";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import server from "./mock/servicosAPI";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import GerenciarUsuariosEmpresa from "../pages/gerencia/GerenciarUsuariosEmpresa";
import { empresas } from "./stub/empresaModelos";
import { usuarios } from "./stub/usuarioModelos";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function setup() {
    return render(
        <MemoryRouter initialEntries={[`/gerenciarUsuariosEmpresa/${empresas[0].cnpj}`]}>
            <AuthProvider>
                <Routes>
                    <Route 
                        path="/gerenciarUsuariosEmpresa/:cnpj" 
                        element={<GerenciarUsuariosEmpresa />} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    )
}

describe("Gerenciar usuários de empresa", () => {

    it("Deve carregar os usuários", async () => {
        autenticar(
            Permissao.PerfilVisualizar, 
            Permissao.EmpresaVisualizar, 
            Permissao.UsuarioVisualizar,
            Permissao.EmpresaGerenciarUsuarios,
            Permissao.EmpresaVisualizarUsuarios
        )

        const screen = setup()

        await waitFor(() => expect(screen.getByText(usuarios[0].nome)).toBeInTheDocument)
    })

    it("Deve abrir modal de cadastrar usuários e confirmar", async () => {
        autenticar(
            Permissao.PerfilVisualizar,
            Permissao.EmpresaVisualizarUsuarios,
            Permissao.EmpresaGerenciarUsuarios
        )

        const screen = setup()

        await waitFor(() => expect(screen.getByText(usuarios[0].nome)).toBeInTheDocument)
        const button = screen.getByText("Adicionar Usuário")
        await waitFor(() => expect(button).toBeInTheDocument)

        act(() => {
            button.click()
        })

        await waitFor(() => expect(screen.getByTestId("overlay")))
        const select = screen.getByTestId("Selecionar UsuárioscustomSelect")
        const selectFirstItem = document.querySelector("#rb0")

        act(() => {
            select.click()
        })

        await waitFor(() => expect(selectFirstItem).toBeInTheDocument)
        act(() => {
            screen.getByTestId("botao-cadastrar").click()
        })

        await waitFor(() => expect(screen.getByTestId("overlay")).not.toBeInTheDocument)
    })
    
    it("Deve abrir modal de cadastrar usuários e cancelar", async () => {
        autenticar(
            Permissao.PerfilVisualizar,
            Permissao.EmpresaVisualizarUsuarios,
            Permissao.EmpresaGerenciarUsuarios
        )

        const screen = setup()

        await waitFor(() => expect(screen.getByText(usuarios[0].nome)).toBeInTheDocument)
        const button = screen.getByText("Adicionar Usuário")
        await waitFor(() => expect(button).toBeInTheDocument)

        act(() => {
            button.click()
        })

        await waitFor(() => expect(screen.getByTestId("overlay")));
        act(() => {
            screen.getByTestId("botao-cancelar").click()
        })
    })

    it("Deve abrir o modal de remover usuario e confirmar", async () => {
        autenticar(
            Permissao.PerfilVisualizar,
            Permissao.EmpresaVisualizarUsuarios,
            Permissao.EmpresaGerenciarUsuarios
        )

        const screen = setup()

        await waitFor(() => expect(screen.getByText(usuarios[0].nome)).toBeInTheDocument)
        const button = screen.getByTestId("table-row-delete-0")
        await waitFor(() => expect(button).toBeInTheDocument)

        act(() => {
            button.click()
        })

        await waitFor(() => expect(screen.getByTestId("overlay")));

        const buttonConfirmar = screen.getByTestId("botao-confirmar")
        act(() => {
            buttonConfirmar.click()
        })
    })

    it("Deve abrir o modal de remover usuario e cancelar", async () => {
        autenticar(
            Permissao.PerfilVisualizar,
            Permissao.EmpresaVisualizarUsuarios,
            Permissao.EmpresaGerenciarUsuarios
        )

        const screen = setup()

        await waitFor(() => expect(screen.getByText(usuarios[0].nome)).toBeInTheDocument)
        const button = screen.getByTestId("table-row-delete-0")
        await waitFor(() => expect(button).toBeInTheDocument)

        act(() => {
            button.click()
        })

        await waitFor(() => expect(screen.getByTestId("overlay")));

        const buttonConfirmar = screen.getByTestId("botao-cancelar")
        act(() => {
            buttonConfirmar.click()
        })
    })
})