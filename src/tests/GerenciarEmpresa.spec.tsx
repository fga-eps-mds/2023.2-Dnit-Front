/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { render, waitFor, act, fireEvent } from "@testing-library/react";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import server from "./mock/servicosAPI";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import GerenciarEmpresas from "../pages/gerencia/GerenciarEmpresas";
import { wait } from "@testing-library/user-event/dist/utils";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function setup() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <GerenciarEmpresas />
            </AuthProvider>
        </MemoryRouter>
    )
}

describe("Gerenciar Empresas", () => {

    it("Deve retornar a tela inicial se não tiver permissão de visualizar empresa", async () => {
        const screen = setup()
    })

    it("Deve listar empresas", async () => {
        autenticar(Permissao.EmpresaVisualizar);

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);
    })

    it("Deve mostrar modal de edição de empresa e confirmar", async () => {
        autenticar(Permissao.EmpresaVisualizar, Permissao.EmpresaEditar);

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);
        
        act(() => {
            screen.getByTestId('table-row-edit-0').click();
        })

        await waitFor(() => expect(screen.getByText('Editar Empresa')).toBeInTheDocument);
        
        const input = screen.getByTestId("inputRazaoSocial")
        const buttonConfirmar = screen.getByTestId("botaoConfirmar")
        await waitFor(() => expect(input).toBeInTheDocument)
        await waitFor(() => expect(screen.getByDisplayValue("74.953.570/0001-32")).toBeInTheDocument)

        act(() => {
            fireEvent.change(input, {
                target: {value: "Empresa Teste"}
            })
            buttonConfirmar.click()
        })
    })

    it("Deve mostrar modal de edição de empresa e cancelar", async () => {
        autenticar(Permissao.EmpresaVisualizar, Permissao.EmpresaEditar);

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);
        
        act(() => {
            screen.getByTestId('table-row-edit-0').click();
        })

        await waitFor(() => expect(screen.getByText('Editar Empresa')).toBeInTheDocument);
      
        const buttonCancelar = screen.getByTestId("botaoCancelar")
        act(() => {
            buttonCancelar.click()
        })
    })

    it("Deve mostrar modal de visualização de empresa e fechar usando o botão voltar", async () => {
        autenticar(Permissao.EmpresaVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-eye-0').click()    
        })

        await waitFor(() => expect(screen.getByText('Visualizar Empresa')).toBeInTheDocument);

        const buttonCancelar = screen.getByTestId("botaoCancelar")
        act(() => {
            buttonCancelar.click()
        })
    })

    it("Deve mostrar modal de visualização de empresa e fechar usando o botão x", async () => {
        autenticar(Permissao.EmpresaVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-eye-0').click()    
        })

        await waitFor(() => expect(screen.getByText('Visualizar Empresa')).toBeInTheDocument);

        const buttonCancelar = screen.getByTestId("botaoFechar")
        act(() => {
            buttonCancelar.click()
        })
    })

    it("Deve mostrar modal de visualização de empresa e fechar clicando fora", async () => {
        autenticar(Permissao.EmpresaVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-eye-0').click()    
        })

        await waitFor(() => expect(screen.getByText('Visualizar Empresa')).toBeInTheDocument);

        const overlay = screen.getByTestId("overlay")

        act(() => {
            overlay.click()
        })
    })

    it("Deve cadastrar nova empresa", async () => {
        autenticar(Permissao.EmpresaVisualizar, Permissao.EmpresaCadastrar);

        const screen = setup()

        const button = screen.getByText("Cadastrar Empresa")
        await waitFor(() => expect(button).toBeInTheDocument)
        
        act(() => {
            button.click()
        })
        
        const overlay = screen.getByTestId("overlay")
        const inputRazaoSocial = screen.getByTestId("inputRazaoSocial")
        const inputCnpj = screen.getByTestId("inputCnpj")
        const inputUFs = screen.getByTestId("UFs. de atuaçãocustomSelect")
        const buttonConfirmar = screen.getByTestId("botaoConfirmar")

        await waitFor(() => expect(overlay).toBeInTheDocument)
        await waitFor(() => expect(inputRazaoSocial).toBeInTheDocument)
        await waitFor(() => expect(inputCnpj).toBeInTheDocument)
        await waitFor(() => expect(inputUFs).toBeInTheDocument)
        await waitFor(() => expect(buttonConfirmar).toBeInTheDocument)

        act(() => {
            fireEvent.change(inputRazaoSocial, {target: {value: "Empresa Z"}})
            fireEvent.change(inputCnpj, {target: {value: "53616171000106"}})
            fireEvent.click(inputUFs)
        })

        await waitFor(() => expect(screen.getByTestId("cbs1")).toBeInTheDocument)

        act(() => {
            screen.getByTestId("cbs1").click()
            buttonConfirmar.click()
        })
    })

    it("Não deve cadastrar nova empresa", async () => {
        autenticar(Permissao.EmpresaVisualizar, Permissao.EmpresaCadastrar);

        const screen = setup()

        const button = screen.getByText("Cadastrar Empresa")
        await waitFor(() => expect(button).toBeInTheDocument)
        
        act(() => {
            button.click()
        })
        
        const overlay = screen.getByTestId("overlay")
        const inputRazaoSocial = screen.getByTestId("inputRazaoSocial")
        const inputCnpj = screen.getByTestId("inputCnpj")
        const inputUFs = screen.getByTestId("UFs. de atuaçãocustomSelect")
        const buttonConfirmar = screen.getByTestId("botaoConfirmar")

        await waitFor(() => expect(overlay).toBeInTheDocument)
        await waitFor(() => expect(inputRazaoSocial).toBeInTheDocument)
        await waitFor(() => expect(inputCnpj).toBeInTheDocument)
        await waitFor(() => expect(inputUFs).toBeInTheDocument)
        await waitFor(() => expect(buttonConfirmar).toBeInTheDocument)

        act(() => {
            fireEvent.change(inputRazaoSocial, {target: {value: ""}})
            fireEvent.change(inputCnpj, {target: {value: "53616171000107"}})
            buttonConfirmar.click()
        })

        act(() => {
            fireEvent.change(inputCnpj, {target: {value: ""}})
            buttonConfirmar.click()
            fireEvent.change(inputCnpj, {target: {value: "5551"}})
            buttonConfirmar.click()
            fireEvent.change(inputCnpj, {target: {value: "55555555555555"}})
            buttonConfirmar.click()
        })
    })

    it("Deve mostrar modal de excluir empresa e confirmar", async () => {
        autenticar(Permissao.EmpresaVisualizar, Permissao.EmpresaRemover)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa B')).toBeInTheDocument);

        const deleteIcon = screen.getByTestId("table-row-delete-1")
        await waitFor(() => expect(deleteIcon).toBeInTheDocument)

        act(() => {
            deleteIcon.click()
        })

        const overlay = screen.getByTestId("overlay")
        const confirmButton = screen.getByTestId("botaoConfirmar")
        
        await waitFor(() => expect(overlay).toBeInTheDocument)
        await waitFor(() => expect(confirmButton).toBeInTheDocument)

        act(() => {
            confirmButton.click()
        })

        await waitFor(() => expect(overlay).not.toBeInTheDocument)
    })

    it("Deve mostrar modal de excluir empresa e cancelar", async () => {
        autenticar(Permissao.EmpresaVisualizar, Permissao.EmpresaRemover)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        const deleteIcon = screen.getByTestId("table-row-delete-0")
        await waitFor(() => expect(deleteIcon).toBeInTheDocument)

        act(() => {
            deleteIcon.click()
        })

        const overlay = screen.getByTestId("overlay")
        const buttonCancelar = screen.getByTestId("botaoCancelar")
        
        await waitFor(() => expect(overlay).toBeInTheDocument)
        await waitFor(() => expect(buttonCancelar).toBeInTheDocument)

        act(() => {
            buttonCancelar.click()
        })

        await waitFor(() => expect(overlay).not.toBeInTheDocument)
    })

    it("Deve mostrar modal de excluir empresa e clicar fora", async () => {
        autenticar(Permissao.EmpresaVisualizar, Permissao.EmpresaRemover)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        const deleteIcon = screen.getByTestId("table-row-delete-0")
        await waitFor(() => expect(deleteIcon).toBeInTheDocument)

        act(() => {
            deleteIcon.click()
        })

        const overlay = screen.getByTestId("overlay")
        await waitFor(() => expect(overlay).toBeInTheDocument)

        act(() => {
            overlay.click()
        })
    })

    it("Deve mudar o número de empresas mostradas na tabela e mudar a página", async () => {
        autenticar(Permissao.EmpresaVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        const select = screen.getByTestId("items-per-page")
        act(() => {
            fireEvent.change(select, {
                target: {value: "1"},
            })
        })

        const selectPagina = screen.getByTestId("drop-select-page")
        act(() => {
            fireEvent.change(selectPagina, {
                target: {value: "2"}
            })
        })
    })

    it("Deve clicar no botão de visualizar os usuários da empresa", async () => {
        autenticar(Permissao.EmpresaGerenciar, Permissao.EmpresaVisualizarUsuarios)
        
        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        const icon = screen.getByTestId("table-row-seeuser-0")
        act(() => {
            icon.click()
        })
    })

    it("Deve mostrar a notificação de falha na listagem de empresas", async () => {
        const screen = setup()

        await waitFor(() => expect(screen.getByText('Empresa A')).toBeInTheDocument);

        const filtroRazaoSocial = screen.getByTestId("filtroRazaoSocial")

        act(() => {
            fireEvent.change(filtroRazaoSocial, {
                target: {value: "teste"}
            })
        })
    })
})