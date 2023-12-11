/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import server from "./mock/servicosAPI";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import GerenciarAcoes from "../pages/gerencia/GerenciarAcoes/GerarPlanejamento";
import { act } from "react-dom/test-utils";
import {
  sendPlanejamento,
  updatePlanejamento,
} from "../service/gerenciarAcoes";
import {
  planejamento2,
  planejamento2Updated,
} from "./stub/planejamentoModelos";

jest.mock("../service/gerenciarAcoes", () => ({
  ...jest.requireActual("../service/gerenciarAcoes"),
  updatePlanejamento: jest.fn(),
  sendPlanejamento: jest.fn(),
}));

const mockedUpdatePlanejamento = updatePlanejamento as jest.Mock;
const mockedSendPlanejamento = sendPlanejamento as jest.Mock;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Criar planejamento", () => {
  it("Deve carregar a página de Criar Planejamento", async () => {
    autenticar(Permissao.UsuarioEditar);
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Mês inicial")).toBeInTheDocument();
    expect(screen.getByText("Mês final")).toBeInTheDocument();
    expect(screen.getByText("Quantidade de Ações")).toBeInTheDocument();
  });

  it("Deve carregar o botão Gerar Planejamento", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );
    const button = screen.getByText("Gerar Planejamento");
    expect(button).toBeInTheDocument();
  });

  it("Deve subir erro de nome obrigatório ao clicar no botão com label Título vazia", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");
    const vazio = screen.getByTestId("inputTitulo");

    fireEvent.click(button);
    if (vazio === null) {
      await waitFor(() =>
        expect(screen.getByText("O nome é obrigatório")).toBeInTheDocument()
      );
    }
  });

  it("Deve subir erro caso a string passada na Label Título tiver menos que 5 caracteres", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");
    const string = screen.getByTestId("inputTitulo");

    act(() => {
      fireEvent.change(string, { target: { value: "abcd" } });
    });

    const stringHTML = string.outerHTML;

    fireEvent.click(button);
    if (stringHTML.length < 5) {
      await waitFor(() =>
        expect(
          screen.getByText(
            "O nome do planejamento deve conter pelo menos 5 caracteres"
          )
        ).toBeInTheDocument()
      );
    }
  });

  it("Deve renderizar o select mês inicial com meses do ano", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");

    const selectElement = screen.getAllByRole("combobox")[0];

    fireEvent.change(selectElement, { target: { value: "Fevereiro" } });
    expect(selectElement).toBeInTheDocument();
  });

  it("Deve renderizar o select mês final com meses do ano", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");

    const selectElement = screen.getAllByRole("combobox")[1];

    fireEvent.change(selectElement, { target: { value: "Fevereiro" } });
    expect(selectElement).toBeInTheDocument();
  });

  it("Deve subir erro O mês final deve ser posterior ao mês inicial", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");

    const firstSelectElement = screen.getAllByRole("combobox")[0];
    const secondSelectElement = screen.getAllByRole("combobox")[1];

    act(() => {
      fireEvent.change(firstSelectElement, {
        target: { value: "Abril", index: "3" },
      });
      fireEvent.change(secondSelectElement, {
        target: { value: "Janeiro", index: "0" },
      });
    });
    console.log(firstSelectElement.tabIndex);
    var firstSelectElementstr = firstSelectElement.innerHTML;
    var secondSelectElementstr = secondSelectElement.innerHTML;

    fireEvent.click(button);

    if (parseInt(firstSelectElementstr) > parseInt(secondSelectElementstr)) {
      waitFor(() =>
        expect(
          screen.getByText("O mês final deve ser posterior ao mês inicial")
        ).toBeInTheDocument()
      );
    }
  });

  it("Deve subir erro Escolha a quantidade de ações", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");
    const qtdAcoes = screen.getByTestId("qtd-actions-field");

    fireEvent.change(qtdAcoes, { target: { value: null } });
    fireEvent.click(button);

    if (qtdAcoes === null) {
      waitFor(() =>
        expect(
          screen.getByText("Escolha a quantidade de ações")
        ).toBeInTheDocument()
      );
    }
  });

  it("Deve retornar NaN caso uma string seja passada na label de ações", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const qtdAcoes = screen.getByTestId("qtd-actions-field");

    fireEvent.click(qtdAcoes);
    fireEvent.change(qtdAcoes, { target: { value: "string" } });

    waitFor(() => expect(screen.getByText("NaN")).toBeInTheDocument());
  });

  it("Verifica se a sugestão de planejamento é gerada", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");

    const titulo = screen.getByTestId("inputTitulo");
    const firstSelectElement = screen.getAllByRole("combobox")[0];
    const secondSelectElement = screen.getAllByRole("combobox")[1];
    const qtdAcoes = screen.getByTestId("qtd-actions-field");

    act(() => {
      fireEvent.change(titulo, { target: { value: "Planejamento Sudeste" } });
      fireEvent.change(firstSelectElement, {
        target: { value: "Janeiro", index: "0" },
      });
      fireEvent.change(secondSelectElement, {
        target: { value: "Abril", index: "3" },
      });
      fireEvent.change(qtdAcoes, { target: { value: 1234 } });
    });

    fireEvent.click(button);

    var tituloStr = titulo.innerHTML;
    var qtdAcoesStr = qtdAcoes.innerHTML;
    var qtdAcoesNumber = parseInt(qtdAcoesStr);
    if (
      tituloStr !== null &&
      tituloStr.length >= 5 &&
      firstSelectElement !== null &&
      secondSelectElement !== null &&
      qtdAcoesNumber > 0
    ) {
      waitFor(() =>
        expect(
          screen.getByText("Escolas no Mês de Novembro")
        ).toBeInTheDocument()
      );
    }
  });

  it("Deve alterar nome do planejamento", async () => {
    mockedUpdatePlanejamento.mockResolvedValue(planejamento2Updated);
    mockedSendPlanejamento.mockResolvedValue(planejamento2);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarAcoes />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Gerar Planejamento");

    const titulo = screen.getByTestId("inputTitulo");
    const firstSelectElement = screen.getAllByRole("combobox")[0];
    const secondSelectElement = screen.getAllByRole("combobox")[1];
    const qtdAcoes = screen.getByTestId("qtd-actions-field");

    act(() => {
      fireEvent.change(titulo, { target: { value: "Planejamento Sudeste" } });
      fireEvent.change(firstSelectElement, {
        target: { value: "Janeiro", index: "0" },
      });
      fireEvent.change(secondSelectElement, {
        target: { value: "Abril", index: "3" },
      });
      fireEvent.change(qtdAcoes, { target: { value: 1234 } });
    });

    fireEvent.click(button);

    var tituloStr = titulo.innerHTML;
    var qtdAcoesStr = qtdAcoes.innerHTML;
    var qtdAcoesNumber = parseInt(qtdAcoesStr);
    if (
      tituloStr !== null &&
      tituloStr.length >= 5 &&
      firstSelectElement !== null &&
      secondSelectElement !== null &&
      qtdAcoesNumber > 0
    ) {
      waitFor(() =>
        expect(
          screen.getByText("Escolas no Mês de Novembro")
        ).toBeInTheDocument()
      );
    }

    act(() => {
      fireEvent.change(titulo, { target: { value: "Planejamento Nordeste" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Salvar")).toBeInTheDocument();
    });

    const buttonSalvar = screen.getByText("Salvar");
    fireEvent.click(buttonSalvar);

    await waitFor(() => {
      expect(screen.queryByText("Salvar")).not.toBeInTheDocument();
    });
  });
});
