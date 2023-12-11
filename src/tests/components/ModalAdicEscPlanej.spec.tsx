import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ModalAdicionarEscola from "../../components/GerenciarAcoesModal/AdicionarEscola";
import { planejamento, planejamento2 } from "../stub/planejamentoModelos";
import server from "../mock/servicosAPI";
import localStorageMock from "../mock/memoriaLocal";
import { updatePlanejamento } from "../../service/gerenciarAcoes";

jest.mock("../../service/gerenciarAcoes", () => ({
  ...jest.requireActual("../../service/gerenciarAcoes"),
  updatePlanejamento: jest.fn(),
}));

const mockedUpdatePlanejamento = updatePlanejamento as jest.Mock;

beforeAll(() => server.listen());
beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
});
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

describe("Modal adicionar Escola", () => {
  it("Deve renderizar o modal de Adicionar Escola", () => {
    let aberto = true;
    render(
      <div>
        {aberto && (
          <ModalAdicionarEscola
            planejamento={planejamento}
            infoMes={planejamento.planejamentoMacroMensal[0]}
            onClose={() => {
              aberto = false;
            }}
          />
        )}
      </div>
    );
    expect(screen.getByText("Adicionar Escola")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Adicionar")).toBeInTheDocument();
  });

  it("Deve testar o filtro do modal", async () => {
    let aberto = true;
    render(
      <div>
        {aberto && (
          <ModalAdicionarEscola
            planejamento={planejamento}
            infoMes={planejamento.planejamentoMacroMensal[0]}
            onClose={() => {
              aberto = false;
            }}
          />
        )}
      </div>
    );
    const input = screen.getByTestId("Procurar escola");

    fireEvent.change(input, { target: { value: "123321" } });
    expect(input).toHaveValue("123321");
  });

  it("Deve testar sair da Modal", async () => {
    let aberto = true;
    render(
      <div>
        {aberto && (
          <ModalAdicionarEscola
            planejamento={planejamento}
            infoMes={planejamento.planejamentoMacroMensal[0]}
            onClose={() => {
              aberto = false;
            }}
          />
        )}
      </div>
    );

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancelar"));
    expect(aberto).toEqual(false);
  });

  it("deve fechar ao clicar no overlay", async () => {
    let aberto = true;
    render(
      <div>
        {aberto && (
          <ModalAdicionarEscola
            planejamento={planejamento}
            infoMes={planejamento.planejamentoMacroMensal[0]}
            onClose={() => {
              aberto = false;
            }}
          />
        )}
      </div>
    );

    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);
    expect(aberto).not.toBeTruthy();
  });

  it("deve mostrar notificação de erro", async () => {
    mockedUpdatePlanejamento.mockRejectedValue(new Error("Erro na requisição"));

    let aberto = true;
    render(
      <div>
        {aberto && (
          <ModalAdicionarEscola
            planejamento={planejamento}
            infoMes={planejamento2.planejamentoMacroMensal[0]}
            onClose={() => {
              aberto = false;
            }}
          />
        )}
      </div>
    );

    const overlay = screen.getByText("Adicionar");
    fireEvent.click(overlay);
    await waitFor(() => {
      expect(
        screen.queryAllByText("Falha em Adicionar Escolas ao Planejamento.")
      ).not.toHaveLength(0);
    });
  });
});
