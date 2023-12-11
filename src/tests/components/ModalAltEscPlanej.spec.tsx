import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ModalAlterarEscola from "../../components/GerenciarAcoesModal/AlterarEscola";
import { escolaSelected, planejamento } from "../stub/planejamentoModelos";

describe("Modal alterar Escola", () => {
  it("Deve renderizar o modal de Alterar Escola", () => {
    let aberto = true;
    render(
      <div>
        {aberto && (
          <ModalAlterarEscola
            escolaSelected={escolaSelected}
            planejamento={planejamento}
            onClose={() => {
              aberto = false;
            }}
            onConfirm={() => {}}
          />
        )}
      </div>
    );
    expect(screen.getByText("Alterar Escolas")).toBeInTheDocument();
  });

  it("deve fechar ao clicar no overlay", async () => {
    let aberto = true;
    render(
      <div>
        {aberto && (
          <ModalAlterarEscola
            escolaSelected={escolaSelected}
            planejamento={planejamento}
            onClose={() => {
              aberto = false;
            }}
            onConfirm={() => {}}
          />
        )}
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText("Alterar Escolas")).toBeInTheDocument();
    });

    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);
    expect(aberto).not.toBeTruthy();
  });
});
