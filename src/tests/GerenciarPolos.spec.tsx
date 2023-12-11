/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { render, waitFor, act, fireEvent } from "@testing-library/react";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import server from "./mock/servicosAPI";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import GerenciarPolos from "../pages/gerencia/GerenciarPolos";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function setup() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <GerenciarPolos />
            </AuthProvider>
        </MemoryRouter>
    )
}

describe("Gerenciar Polos", () => {

    it("Deve retornar a tela inicial se não tiver permissão de visualizar polos", async () => {
        const screen = setup()
    })

    it("Deve listar polos", async () => {
        autenticar(Permissao.PoloVisualizar);

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);
    })


    it("Deve mostrar modal de edição de polo e confirmar", async () => {
        autenticar(Permissao.PoloVisualizar, Permissao.PoloEditar);

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-edit-0').click();
        })

        await waitFor(() => expect(screen.getByText('Atualizar Polo')).toBeInTheDocument);

        const input = screen.getByTestId("inputNome")
        const buttonConfirmar = screen.getByTestId("botaoConfirmar")
        await waitFor(() => expect(input).toBeInTheDocument)

        act(() => {
            fireEvent.change(input, {
                target: {value: "Polo Teste"}
            })
            buttonConfirmar.click()
        })
    })

    it("Deve mostrar modal de edição de polo e cancelar", async () => {
        autenticar(Permissao.PoloVisualizar, Permissao.PoloEditar);

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-edit-0').click();
        })

        await waitFor(() => expect(screen.getByText('Atualizar Polo')).toBeInTheDocument);

        const buttonCancelar = screen.getByTestId("botaoCancelar")
        act(() => {
            buttonCancelar.click()
        })
    })

    it("Deve mostrar modal de visualização de polo e fechar usando o botão voltar", async () => {
        autenticar(Permissao.PoloVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-eye-0').click()
        })

        await waitFor(() => expect(screen.getByText('Informações do Polo')).toBeInTheDocument);

        const buttonCancelar = screen.getByTestId("botaoCancelar")
        act(() => {
            buttonCancelar.click()
        })
    })


    it("Deve mostrar modal de visualização de polo e fechar usando o botão x", async () => {
        autenticar(Permissao.PoloVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-eye-0').click()
        })

        await waitFor(() => expect(screen.getByText('Informações do Polo')).toBeInTheDocument);

        const buttonCancelar = screen.getByTestId("botaoFechar")
        act(() => {
            buttonCancelar.click()
        })
    })


    it("Deve mostrar modal de visualização de polo e fechar clicando fora", async () => {
        autenticar(Permissao.PoloVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

        act(() => {
            screen.getByTestId('table-row-eye-0').click()
        })

        await waitFor(() => expect(screen.getByText('Informações do Polo')).toBeInTheDocument);

        const overlay = screen.getByTestId("overlay")

        act(() => {
            overlay.click()
        })
    })


    it("Deve cadastrar novo polo", async () => {
        autenticar(Permissao.PoloVisualizar, Permissao.PoloCadastrar);

        const screen = setup()

        const button = screen.getByText("Cadastrar Polo")
        await waitFor(() => expect(button).toBeInTheDocument)

        act(() => {
            button.click()
        })

        const overlay = screen.getByTestId("overlay")
        const inputNome = screen.getByTestId("inputNome")
        const inputEndereco = screen.getByTestId("inputEndereco")
        const inputLatitude = screen.getByTestId("inputLatitude")
        const inputLongitude = screen.getByTestId("inputLongitude")
        const inputCEP = screen.getByTestId("inputCEP")
        const buttonConfirmar = screen.getByTestId("botaoConfirmar")

        await waitFor(() => expect(overlay).toBeInTheDocument)
        await waitFor(() => expect(inputNome).toBeInTheDocument)
        await waitFor(() => expect(inputEndereco).toBeInTheDocument)
        await waitFor(() => expect(inputLatitude).toBeInTheDocument)
        await waitFor(() => expect(inputLongitude).toBeInTheDocument)
        await waitFor(() => expect(inputCEP).toBeInTheDocument)
        await waitFor(() => expect(buttonConfirmar).toBeInTheDocument)

        act(() => {
            fireEvent.change(inputNome, {target: {value: "Polo"}})
            fireEvent.change(inputEndereco, {target: {value: "c"}})
            fireEvent.change(inputLatitude, {target: {value: "1,2"}})
            fireEvent.change(inputLongitude, {target: {value: "-1,2"}})
            fireEvent.change(inputCEP, {target: {value: "70000-100"}})
            buttonConfirmar.click()
        })
    })

    test('Deve testar o parser de Latitude e Longitude', async () => {
        autenticar(Permissao.PoloVisualizar, Permissao.PoloCadastrar);

        const screen = setup()

        const button = screen.getByText("Cadastrar Polo")
        await waitFor(() => expect(button).toBeInTheDocument)

        act(() => {
            button.click()
        })
    
        const latitude = screen.getByTestId("inputLatitude") as HTMLInputElement;
        const longitude = screen.getByTestId("inputLongitude") as HTMLInputElement;
        await waitFor(() => fireEvent.paste(latitude, {
                clipboardData: {
                getData: () => "-15.758173462592291, -47.90013307875956",
                },
            })
        );
        expect(latitude?.value).toBe('-15.758173');
        expect(longitude?.value).toBe('-47.900133');
      });

    it("Deve mostrar modal de excluir polo e confirmar", async () => {
        autenticar(Permissao.PoloVisualizar, Permissao.PoloRemover)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

        const deleteIcon = screen.getByTestId("table-row-delete-0")
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


    it("Deve mostrar modal de excluir polo e cancelar", async () => {
        autenticar(Permissao.PoloVisualizar, Permissao.PoloRemover)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

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


    it("Deve mostrar modal de excluir polo e clicar fora", async () => {
        autenticar(Permissao.PoloVisualizar, Permissao.PoloRemover)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

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


    it("Deve mudar o número de polos mostrados na tabela e mudar a página", async () => {
        autenticar(Permissao.PoloVisualizar)

        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

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

    it("Deve mostrar a notificação de falha na listagem de polos", async () => {
        const screen = setup()

        await waitFor(() => expect(screen.getByText('Superintendência regional do DNIT em Alagoas')).toBeInTheDocument);

        const filtroCep = screen.getByTestId("filtroCep")

        act(() => {
            fireEvent.change(filtroCep, {
                target: {value: "-99999"}
            })
        })
    })
})
