import { fireEvent, render, waitFor } from "@testing-library/react";
import ModalRanqueEscola from "../../components/EscolaRanqueModal";
import server from "../mock/servicosAPI";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


describe('RanqueEscolaModal', () => {
  it('deve mostrar informacoes de escola', async () => {
    const screen = render(
      <ModalRanqueEscola
        escolaId="1"
        onClose={() => { }}
        onCreateAcao={() => { }} />
    );

    await waitFor(() => expect(screen.getByText("Fator UPS, Peso 1, Valor 1454")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Município: municipio")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Total: 1000")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Solicitação: Esta escola possui solicitação de ação")).toBeInTheDocument());


    const modalContent = screen.getByTestId('overlay');
    fireEvent.click(modalContent);
  });

  it('deve mostrar loading', async () => {
    const screen = render(
      <ModalRanqueEscola
        escolaId="1"
        onClose={() => { }}
        onCreateAcao={() => { }} />
    );

    await waitFor(() => expect(screen.getByText("Carregando Escola...")).toBeInTheDocument());

    const modalContent = screen.getByTestId('overlay');
    fireEvent.click(modalContent);
  });

  it('deve não mostrar as informações da escola', async () => {
    const screen = render(
      <ModalRanqueEscola
        escolaId="2"
        onClose={() => { }}
        onCreateAcao={() => { }} />
    );

    await waitFor(() => expect(screen.getByText("Solicitação: Não há registro de solicitacao")).toBeInTheDocument());

  })
});