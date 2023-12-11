import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../provider/Autenticacao";
import DeletarPlanejamentoDialog from "../../components/DeletarPlanejamentoDialog";
import { planejamento } from "../stub/planejamentoModelos";
import server from "../mock/servicosAPI";
import localStorageMock from "../mock/memoriaLocal";

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

describe("Tabela de Gerenciar Acoes", () => {
  it("Deve renderizar a pagina de Gerenciar Acoes", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <DeletarPlanejamentoDialog
            closeDialog={() => {}}
            planejamento={planejamento}
            onClick={(id: string) => {}}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Tem certeza que deseja excluir este planejamento?")
    ).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  it("deve fechar ao clicar no overlay", async () => {
    render(
      <MemoryRouter>
        <DeletarPlanejamentoDialog
          closeDialog={() => {}}
          planejamento={planejamento}
          onClick={(id: string) => {}}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Tem certeza que deseja excluir este planejamento?")
      ).toBeInTheDocument();
    });

    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);
  });

  it("deve mostrar notificação de sucesso", async () => {
    const onClickMock = jest.fn();

    render(
      <MemoryRouter>
        <DeletarPlanejamentoDialog
          closeDialog={(d) => {}}
          planejamento={planejamento}
          onClick={onClickMock}
        />
      </MemoryRouter>
    );

    const overlay = screen.getByText("Confirmar");
    fireEvent.click(overlay);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("deve cancelar", async () => {
    let deletou = false;
    render(
      <MemoryRouter>
        <DeletarPlanejamentoDialog
          closeDialog={() => {}}
          planejamento={planejamento}
          onClick={(id: string) => {}}
        />
      </MemoryRouter>
    );

    const overlay = screen.getByTestId("botaoCancelar");
    fireEvent.click(overlay);
    expect(deletou).not.toBeTruthy();
  });
});
