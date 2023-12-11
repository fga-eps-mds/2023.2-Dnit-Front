/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import server from "./mock/servicosAPI";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import GerenciarPrioridades from "../pages/gerencia/GerenciarPrioridades";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function setup() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <GerenciarPrioridades />
            </AuthProvider>
        </MemoryRouter>
    )
}

describe("Gerenciar Prioridades", () => {
    it("Deve renderizar a página de gerenciar prioridades", async() => {
        const screen = setup();
    })

    it("Deve listar fatores", async () => {
        const screen = setup();
        
        await waitFor(() => expect(screen.getByTestId("inputFatorUPS")).toBeInTheDocument);

    })

    it("Deve editar peso do custo logístico", async () => {
        const screen = setup();
        
        await waitFor(() => expect(screen.getByTestId("pesoCusto Logistico")).toBeInTheDocument);
        const botaoSalvar = screen.getByTestId("botaoSalvarCusto Logistico");
        act(() => {
            botaoSalvar.click();
        })
    })

    it("Deve alterar parâmetro do custo logístico", async () => {
        const screen = setup();
        
        await waitFor(() => expect(screen.getByTestId("raioParam1")).toBeInTheDocument);
        await waitFor(() => expect(screen.getByTestId("botaoSalvarCusto Logistico")).toBeInTheDocument);
        await waitFor(() => expect(screen.getByTestId("valorParam1")).toBeInTheDocument);
        
        const raioInput = screen.getByTestId("raioParam1");
        const valorInput = screen.getByTestId("valorParam1");
        const botaoSalvar = screen.getByTestId("botaoSalvarCusto Logistico");

        act(() => {
            fireEvent.change(raioInput, {
                target: {value: "5"}
            })
            botaoSalvar.click();
            fireEvent.change(valorInput, {
                target: {value: "66"}
            })
            botaoSalvar.click();
        })
    })

    it("Deve editar fator", async () => {
        const screen = setup();
        
        await waitFor(() => expect(screen.getByTestId("inputFatorFator A")).toBeInTheDocument);
        await waitFor(() => expect(screen.getByTestId("botaoSalvarFator A")).toBeInTheDocument);
        const input = screen.getByTestId("inputFatorFator A");
        const botaoSalvar = screen.getByTestId("botaoSalvarFator A");

        act(() => {
            fireEvent.change(input, {
                target: {value: "Fator Editado"}
            })
            botaoSalvar.click();
        })
    })

    it("Não deve salvar fator com nome vazio", async () => {
        const screen = setup();
        
        await waitFor(() => expect(screen.getByTestId("inputFatorFator A")).toBeInTheDocument);
        const input = screen.getByTestId("inputFatorFator A");
        const botaoSalvar = screen.getByTestId("botaoSalvarFator A");

        act(() => {
            fireEvent.change(input, {
                target: {value: "Fator Editado"}
            })
            botaoSalvar.click();
        })
    })

    it("Deve excluir fator", async () => {
        const screen = setup();
        
        await waitFor(() => expect(screen.getByTestId("botaoExcluirFator B")).toBeInTheDocument);
        const botaoExcluir = screen.getByTestId("botaoExcluirFator B");

        act(() => {
            botaoExcluir.click();
        })
    })

    it("Deve criar novo fator", async () => {
        const screen = setup();
        
        await waitFor(() => expect(screen.getByTestId("inputFatorFator B")).toBeInTheDocument);
        const input = screen.getByTestId("inputFatorFator B");
        const botaoSalvar = screen.getByTestId("botaoSalvarFator B");
        act(() => {
            fireEvent.change(input, {
                target: {value: "Novo Fator"}
            })
            botaoSalvar.click();
        })
    })
})