import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import server from "./mock/servicosAPI";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import GerenciarAcoes from "../pages/gerencia/GerenciarAcoes/Home";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Tabela de Gerenciar Acoes', () => {
    
    it("Deve renderizar a pagina de Gerenciar Acoes", async () => {
        autenticar(Permissao.UsuarioEditar)
        render(
            <MemoryRouter>
                <AuthProvider>
                    <GerenciarAcoes/>
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText("Nome:")).toBeInTheDocument();
        expect(screen.getByText("Período:")).toBeInTheDocument();
        expect(screen.getByText("Responsável:")).toBeInTheDocument();

        expect(screen.getByTestId("inputNome")).toHaveValue("");
        expect(screen.getByTestId("inputResponsavel")).toHaveValue("");
        expect(screen.getByLabelText("Período:")).toHaveValue("");
    });
    
})