/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { render, waitFor, act, fireEvent } from "@testing-library/react";
import server from "../mock/servicosAPI";
import AdicionarUsuarioDialog from "../../components/AdicionarUsuarioDialog";
import { empresas } from "../stub/empresaModelos";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testes para o componente AdicionarUsuarioDialog", () => {

    it("Deve abrir o componente", () => {
        const screen = render(
            <AdicionarUsuarioDialog 
                closeDialog={() => {}}
                nomeEmpresa={empresas[0].razaoSocial}
                cnpj={empresas[0].cnpj}
            />
        )

        expect(screen.getByText("Selecionar Usuários")).toBeInTheDocument();
    })

    it("Deve mostrar a lista de usuários no select", async () => {
        const screen = render(
            <AdicionarUsuarioDialog 
                closeDialog={() => {}}
                nomeEmpresa={empresas[0].razaoSocial}
                cnpj={empresas[0].cnpj}
            />
        )

        act(() => {
            screen.getByTestId("Selecionar UsuárioscustomSelect").click();
        })

        await waitFor(() => expect(screen.getByTestId("Selecionar Usuários0")).toBeInTheDocument);
    })

    it("Deve adicionar novo usuário", async () => {
        const screen = render(
            <AdicionarUsuarioDialog 
                closeDialog={() => {}}
                nomeEmpresa={empresas[0].razaoSocial}
                cnpj={empresas[0].cnpj}
            />
        )

        act(() => {
            fireEvent.focus(screen.getByTestId("select-simple"));
            fireEvent.change(screen.getByTestId("select-simple"), { target: { value: "us" } });
        })

        act(() => {
            screen.getByTestId("Selecionar UsuárioscustomSelect").click();
        })

        await waitFor(() => expect(screen.getByTestId("Selecionar Usuários0")).toBeInTheDocument);

        act(() => {
            screen.getByTestId("Selecionar Usuários0").click();
        })

        await waitFor(() => expect(screen.getByTestId("usuarioadicionar0")).toBeInTheDocument)

        act(() => {
            screen.getByTestId("botao-cadastrar").click();
        })
    })

    it("Deve clicar no botão de cancelar", () => {
        const screen = render(
            <AdicionarUsuarioDialog 
                closeDialog={() => {}}
                nomeEmpresa={empresas[0].razaoSocial}
                cnpj={empresas[0].cnpj}
            />
        )

        act(() => {
            fireEvent.focus(screen.getByTestId("select-simple"));
            fireEvent.change(screen.getByTestId("select-simple"), { target: { value: "us" } });
            fireEvent.change(screen.getByTestId("select-simple"), { target: { value: "" } });
            screen.getByTestId("botao-cancelar").click();
        })
    })

    it("Deve adicionar um usuário e remover em seguida", async () => {
        const screen = render(
            <AdicionarUsuarioDialog 
                closeDialog={() => {}}
                nomeEmpresa={empresas[0].razaoSocial}
                cnpj={empresas[0].cnpj}
            />
        )

        act(() => {
            fireEvent.focus(screen.getByTestId("select-simple"));
            fireEvent.change(screen.getByTestId("select-simple"), { target: { value: "us" } });
        })

        act(() => {
            screen.getByTestId("Selecionar UsuárioscustomSelect").click();
        })
        
        await waitFor(() => expect(screen.getByTestId("Selecionar Usuários0")).toBeInTheDocument);

        act(() => {
            screen.getByTestId("Selecionar Usuários0").click();
        })

        await waitFor(() => expect(screen.getByTestId("usuarioadicionar0")).toBeInTheDocument)
        
        act(() => {
            screen.getByTestId("usuarioadicionarcancelar0").click()
        })
    })

    it("Deve clicar em adicionar sem adicionar nenhum usuário", () => {
        const screen = render(
            <AdicionarUsuarioDialog 
                closeDialog={() => {}}
                nomeEmpresa={empresas[0].razaoSocial}
                cnpj={empresas[0].cnpj}
            />
        )

        act(() => {
            screen.getByTestId("botao-cadastrar").click()
        })
    })

    it("Deve sair do modal ao clicar fora", () => {
        const screen = render(
            <AdicionarUsuarioDialog 
                closeDialog={() => {}}
                nomeEmpresa={empresas[0].razaoSocial}
                cnpj={empresas[0].cnpj}
            />
        )

        act(() => {
            screen.getByTestId("overlay").click()
        })
    })
})