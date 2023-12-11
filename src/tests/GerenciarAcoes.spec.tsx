import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import server from "./mock/servicosAPI";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import GerenciarAcoes from "../pages/gerencia/GerenciarAcoes/Home";
import { fetchPlanejamentos } from "../service/gerenciarAcoes";
import { fetchPlanejamentosResponse } from "./stub/planejamentoModelos";

jest.mock("../service/gerenciarAcoes", () => ({
  ...jest.requireActual("../service/gerenciarAcoes"),
  fetchPlanejamentos: jest.fn(),
}));

const mockedFetchPlanejamento = fetchPlanejamentos as jest.Mock;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Tabela de Gerenciar Acoes", () => {
  it("Deve renderizar a pagina de Gerenciar Acoes", async () => {
    mockedFetchPlanejamento.mockResolvedValue(fetchPlanejamentosResponse);

    autenticar(Permissao.UsuarioEditar);
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("Período:")).toBeInTheDocument();
    expect(screen.getByText("Responsável:")).toBeInTheDocument();
  });

  it("Deve filtrar as Acoes", async () => {
    mockedFetchPlanejamento.mockResolvedValue(fetchPlanejamentosResponse);

    autenticar(Permissao.RanqueVisualizar);

    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );
    const inputs = screen.getAllByTestId("filtroNome");

    fireEvent.change(inputs[0], {
      target: { value: "PLANEJAMENTO CENTRO OESTE" },
    });
    expect(inputs[0]).toHaveValue("PLANEJAMENTO CENTRO OESTE");

    fireEvent.change(inputs[1], { target: { value: "Wellington Guimarães" } });
    expect(inputs[1]).toHaveValue("Wellington Guimarães");
  });

  it("Deve renderizar a pagina de Gerenciar Acoes (BOTAO)", async () => {
    mockedFetchPlanejamento.mockResolvedValue(fetchPlanejamentosResponse);

    autenticar(Permissao.UsuarioEditar);
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const novoPlanejamentoButton = await screen.findByTestId(
      "botaoPossuiPermissao"
    );
    expect(novoPlanejamentoButton).toBeInTheDocument();
  });

  it("Deve renderizar a tabela", async () => {
    mockedFetchPlanejamento.mockResolvedValue(fetchPlanejamentosResponse);

    autenticar(Permissao.UsuarioEditar);
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Quantidade de Ações")).toBeInTheDocument();
    });
  });

  it("Deve verificar se o filtro ta vazio", async () => {
    mockedFetchPlanejamento.mockResolvedValue(fetchPlanejamentosResponse);

    autenticar(Permissao.RanqueVisualizar);

    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );
    const inputs = screen.getAllByTestId("filtroNome");
    expect(inputs[0]).toHaveValue("");
    expect(inputs[1]).toHaveValue("");
  });
});
