/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import server from "./mock/servicosAPI";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import {
  escolasFiltradasResponse,
  planejamento2,
  planejamento2Updated,
} from "./stub/planejamentoModelos";
import { fetchListarEscolasFiltradas } from "../service/escolaApi";
import PlanejamentoInfo from "../pages/gerencia/GerenciarAcoes/PlanejamentoInfo";
import { updatePlanejamento } from "../service/gerenciarAcoes";
import DeletarEscolaDialog from "../components/DeletarEscolaDialog";

jest.mock("../service/escolaApi", () => ({
  ...jest.requireActual("../service/escolaApi"),
  fetchListarEscolasFiltradas: jest.fn(),
}));

jest.mock("../service/gerenciarAcoes", () => ({
  ...jest.requireActual("../service/gerenciarAcoes"),
  updatePlanejamento: jest.fn(),
}));

const mockedFetchListarEscolasFiltradas =
  fetchListarEscolasFiltradas as jest.Mock;

const mockedUpdatePlanejamento = updatePlanejamento as jest.Mock;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Tabela de Gerenciar Acoes", () => {
  it("Deve renderizar a pagina de Planejamento Info", async () => {
    mockedFetchListarEscolasFiltradas.mockResolvedValue(
      escolasFiltradasResponse
    );
    autenticar(Permissao.UsuarioEditar);
    render(
      <MemoryRouter>
        <AuthProvider>
          <PlanejamentoInfo planejamento={planejamento2} />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("UPS")).toBeInTheDocument();
    expect(screen.getByText("Escola")).toBeInTheDocument();
    expect(screen.getByText("UF")).toBeInTheDocument();
    expect(screen.getByText("Quantidade de Alunos")).toBeInTheDocument();
  });

  it("Deve renderizar a tabela", async () => {
    mockedFetchListarEscolasFiltradas.mockResolvedValue(
      escolasFiltradasResponse
    );

    autenticar(Permissao.UsuarioEditar);
    render(
      <MemoryRouter>
        <AuthProvider>
          <PlanejamentoInfo planejamento={planejamento2} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Quantidade de Alunos")).toBeInTheDocument();
    });
  });

  it("Deve apertar o botão de excluir uma escola e dar erro", async () => {
    mockedUpdatePlanejamento.mockRejectedValue(new Error("Erro na requisição"));
    mockedFetchListarEscolasFiltradas.mockResolvedValue(
      escolasFiltradasResponse
    );

    autenticar(Permissao.UsuarioEditar);
    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <PlanejamentoInfo planejamento={planejamento2} />
        </AuthProvider>
      </MemoryRouter>
    );

    const deleteIcon = screen.getByTestId("table-row-delete-0");
    fireEvent.click(deleteIcon);

    await waitFor(() => {
      expect(screen.getByText("Confirmar")).toBeInTheDocument();
    });

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);
  });

  it("Deve mudar info da página quando clicar no card de outro mês", async () => {
    mockedFetchListarEscolasFiltradas.mockResolvedValue(
      escolasFiltradasResponse
    );

    autenticar(Permissao.UsuarioEditar);
    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <PlanejamentoInfo planejamento={planejamento2} />
        </AuthProvider>
      </MemoryRouter>
    );

    const anotherMonthCard = screen.getByText("FEV/23");
    fireEvent.click(anotherMonthCard);

    await waitFor(() => {
      expect(
        screen.getByText("Planejamento Macro Fevereiro / 2023")
      ).toBeInTheDocument();
    });
  });

  it("Deve mudar os meses das escolas ao escolher duas escolas", async () => {
    mockedFetchListarEscolasFiltradas.mockResolvedValue(
      escolasFiltradasResponse
    );
    mockedUpdatePlanejamento.mockResolvedValue(planejamento2Updated);

    autenticar(Permissao.UsuarioEditar);
    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <PlanejamentoInfo planejamento={planejamento2} />
        </AuthProvider>
      </MemoryRouter>
    );

    act(() => {
      const changeIcon = screen.getByTestId("table-row-change-0");
      fireEvent.click(changeIcon);
    });

    const newSchool = screen.getByText("Nome: Escola Teste");
    fireEvent.click(newSchool);

    const trocarButton = screen.getByText("Trocar");
    fireEvent.click(trocarButton);

    await waitFor(() => {
      expect(screen.getByText("Escola Teste")).toBeInTheDocument();
    });
  });

  it("Deve visualizar detalhes de uma escola", async () => {
    mockedFetchListarEscolasFiltradas.mockResolvedValue(
      escolasFiltradasResponse
    );
    mockedUpdatePlanejamento.mockResolvedValue(planejamento2Updated);

    autenticar(Permissao.UsuarioEditar);
    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <PlanejamentoInfo planejamento={planejamento2} />
        </AuthProvider>
      </MemoryRouter>
    );

    act(() => {
      const changeIcon = screen.getByTestId("table-row-eye-0");
      fireEvent.click(changeIcon);
    });

    const schoolDetails = screen.getByText("Escola Teste");
    fireEvent.click(schoolDetails);
  });

  it("Deve visualizar modal de deltar uma escola", async () => {
    mockedFetchListarEscolasFiltradas.mockResolvedValue(
      escolasFiltradasResponse
    );
    mockedUpdatePlanejamento.mockResolvedValue(planejamento2Updated);

    autenticar(Permissao.UsuarioEditar);
    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <PlanejamentoInfo planejamento={planejamento2} />
        </AuthProvider>
      </MemoryRouter>
    );

    act(() => {
      const changeIcon = screen.getByTestId("table-row-delete-0");
      fireEvent.click(changeIcon);
    });

    expect(
      screen.getByText("Tem certeza que deseja excluir esta escola?")
    ).toBeInTheDocument();
    expect(screen.getByTestId("delete-text")).toBeInTheDocument();
  });

  it("Deve fechar modal de deletar escola ao clicar em cancelar", async () => {
    let aberto = true;

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <DeletarEscolaDialog
            closeDialog={() => {
              aberto = false;
            }}
            onConfirm={() => {}}
            escola={{
              id: "escola-a",
              custoLogistico: 1,
              nome: "Escola Teste",
              quantidadeAlunos: 200,
              uf: "DF",
              ups: 200,
            }}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("delete-text")).toBeInTheDocument();
    const deleteButton = screen.getByText("Cancelar");
    fireEvent.click(deleteButton);

    expect(aberto).toEqual(false);
  });

  it("Deve fechar modal de deletar escola ao clicar no overlay", async () => {
    let aberto = true;

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <DeletarEscolaDialog
            closeDialog={() => {
              aberto = false;
            }}
            onConfirm={() => {}}
            escola={{
              id: "escola-a",
              custoLogistico: 1,
              nome: "Escola Teste",
              quantidadeAlunos: 200,
              uf: "DF",
              ups: 200,
            }}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);

    expect(aberto).toEqual(false);
  });
});
