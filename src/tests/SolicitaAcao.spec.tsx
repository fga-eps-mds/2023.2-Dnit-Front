/* eslint-disable testing-library/render-result-naming-convention */
/* eslint-disable testing-library/no-unnecessary-act */
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import server from "./mock/servicosAPI";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

describe('Teste para o formulario de solicitacao de acao', () => {

  test("Abre duas vezes", async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/solicitacaoAcao"]}>
          <App />
        </MemoryRouter>
      );
    });

    const ufSelect = screen.getByLabelText("UF");
    fireEvent.mouseDown(ufSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const UFSelecionada = screen.getByText("Acre");
    fireEvent.click(UFSelecionada);

    const municipioSelect = screen.getByLabelText("Municipios");
    fireEvent.mouseDown(municipioSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const municipioSelecionado = screen.getByText("Acrelândia");
    fireEvent.click(municipioSelecionado);

    const escolaioSelect = screen.getByLabelText("Escola");
    fireEvent.mouseDown(escolaioSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const escolaSelecionada = screen.getByText("ESC ALTINA MAGALHAES DA SILVA");
    fireEvent.click(escolaSelecionada);

    fireEvent.mouseDown(ufSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    fireEvent.mouseDown(municipioSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
  });

  test("Sem selecionar UF", async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/solicitacaoAcao"]}>
          <App />
        </MemoryRouter>
      );
    });

    const municipioSelect = screen.getByLabelText("Municipios");
    fireEvent.mouseDown(municipioSelect);

    const escolaioSelect = screen.getByLabelText("Escola");
    fireEvent.mouseDown(escolaioSelect);
  });

  test("Selecionar escola", async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/solicitacaoAcao"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Selecione uma UF")).toBeInTheDocument();
    expect(screen.getByText("Nenhuma UF selecionada")).toBeInTheDocument();
    expect(screen.getByText("Nenhum municipio selecionado")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione os ciclos de ensino da escola")
    ).toBeInTheDocument();

    const ufSelect = screen.getByLabelText("UF");
    fireEvent.mouseDown(ufSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const UFSelecionada = screen.getByText("Acre");
    fireEvent.click(UFSelecionada);

    const municipioSelect = screen.getByLabelText("Municipios");
    fireEvent.mouseDown(municipioSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const municipioSelecionado = screen.getByText("Acrelândia");
    fireEvent.click(municipioSelecionado);

    const escolaioSelect = screen.getByLabelText("Escola");
    fireEvent.mouseDown(escolaioSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const escolaSelecionada = screen.getByText("ESC ALTINA MAGALHAES DA SILVA");
    fireEvent.click(escolaSelecionada);
  });

  test("Envia Solicitação", async () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={["/solicitacaoAcao"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Selecione uma UF")).toBeInTheDocument();
    expect(screen.getByText("Nenhuma UF selecionada")).toBeInTheDocument();
    expect(screen.getByText("Nenhum municipio selecionado")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione os ciclos de ensino da escola")
    ).toBeInTheDocument();

    const ufSelect = screen.getByLabelText("UF");
    fireEvent.mouseDown(ufSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const UFSelecionada = screen.getByText("Acre");
    fireEvent.click(UFSelecionada);

    const municipioSelect = screen.getByLabelText("Municipios");
    fireEvent.mouseDown(municipioSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const municipioSelecionado = screen.getByText("Acrelândia");
    fireEvent.click(municipioSelecionado);

    const escolaioSelect = screen.getByLabelText("Escola");
    fireEvent.mouseDown(escolaioSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const escolaSelecionada = screen.getByText("ESC ALTINA MAGALHAES DA SILVA");
    fireEvent.click(escolaSelecionada);

    const etapaSelect = screen.getByLabelText("Ciclos de Ensino");
    fireEvent.mouseDown(etapaSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const etapaSelecionada = screen.getByText("Educação de Jovens Adultos");
    fireEvent.click(etapaSelecionada);

    const campoNome = screen.getByLabelText("Nome do Solicitante");
    fireEvent.change(campoNome, { target: { value: "Fulano" } });

    const campoEmail = screen.getByLabelText("E-mail");
    fireEvent.change(campoEmail, { target: { value: "fulano@cicrano.com" } });

    const campoTelefone = screen.getByLabelText("Telefone");
    fireEvent.change(campoTelefone, { target: { value: "61983446661" } });

    const campoQuantidadeAlunos = screen.getByLabelText("Quantidade de Alunos");
    fireEvent.change(campoQuantidadeAlunos, { target: { value: 9 } });

    const vinculoSelect = screen.getByLabelText("Vínculo com a Escola");
    fireEvent.mouseDown(vinculoSelect);

    const vinculoSelecionado = screen.getByTestId("Professor");
    fireEvent.click(vinculoSelecionado);

    const botaoEnviar = screen.getByText("Enviar");
    fireEvent.click(botaoEnviar);

  });

  test("Etapas de ensino", async () => {
    const screen = render(
      <MemoryRouter initialEntries={["/solicitacaoAcao"]}>
        <App />
      </MemoryRouter>
    );

    const etapaSelect = screen.getByLabelText("Ciclos de Ensino");
    fireEvent.mouseDown(etapaSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const etapaSelecionada = screen.getByText("Educação de Jovens Adultos");
    fireEvent.click(etapaSelecionada);

    const ufSelect = screen.getByLabelText("UF");
    fireEvent.mouseDown(ufSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    fireEvent.mouseDown(etapaSelect);
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  test("Entrar", async () => {
    const screen = render(
      <MemoryRouter initialEntries={["/solicitacaoAcao"]}>
        <App />
      </MemoryRouter>
    );

    const escolas = screen.getByText("Entrar");
    fireEvent.click(escolas);
  });
});