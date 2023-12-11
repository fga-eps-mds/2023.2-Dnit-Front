import { render, fireEvent, waitFor } from '@testing-library/react';
import ModalExportarRanque from '../components/ExportarRanqueModal';
import server from './mock/servicosAPI';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ModalExportarRanque component', () => {
  const onCloseMock = jest.fn();
  const mockProps = {
    onClose: onCloseMock,
  };

  test('Deve chamar onClose quando fechar e clicado', async () => {
    const screen = render(<ModalExportarRanque {...(mockProps as any)} />);
    await waitFor(() => expect(screen.getByText('Fechar')).toBeInTheDocument());
    await waitFor(() => fireEvent.click(screen.getByText('Fechar')));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('Deve carregar Histórico de Ranques na tela uma vez', async () => {
    const { getByText } = render(<ModalExportarRanque onClose={() => {}} />)

    await waitFor(() => expect(getByText('Histórico de Ranques')).toBeInTheDocument());
  });

  test('Deve carregar Histórico de Ranques na tela', async () => {
    const onClose = jest.fn();
    const ranqueId = 'RanqueId';

    const { getByText } = render(
      <ModalExportarRanque onClose={onClose} />
    );
    await waitFor(() => expect(getByText('Histórico de Ranques')).toBeInTheDocument());
  });

  test('Deve abrir DetalhesRanqueModal quando ícone olho é clicado', async () => {
    const screen = render(
      <ModalExportarRanque
        onClose={() => { }} />
    );
    await waitFor(() => expect(screen.getByText("Histórico de Ranques")).toBeInTheDocument())
    await waitFor(() => fireEvent.click(screen.getByTestId('table-row-eye-0')));
    await expect(screen.getByText("Detalhes do Ranque")).toBeInTheDocument();
    fireEvent.click(screen.queryAllByText('Fechar')[0]);
  });

  test('Deve exportar dados quando ícone de download é clicado', async () => {
    const screen = render(
      <ModalExportarRanque
        onClose={() => { }} />
    );
    await waitFor(() => expect(screen.getByText("Histórico de Ranques")).toBeInTheDocument())
    await waitFor(() => fireEvent.click(screen.getByTestId('table-row-download-0')));
    await waitFor(() => screen.getByText('A exportação dos dados foi realizada com sucesso'));
  });

  test('Deve carregar a tabela', async () => {
    const screen = render(
      <ModalExportarRanque
        onClose={() => { }} />
    );
    await waitFor(() => expect(screen.getByText("Histórico de Ranques")).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText("7777")).toBeInTheDocument())
  });

  it("Deve paginar os ranques", async () => {
    const screen = render(
      <ModalExportarRanque
        onClose={() => { }} />
    );

    await waitFor(() => expect(screen.getByText("7777")).toBeInTheDocument());
    fireEvent.change(screen.getByTestId("items-per-page"), { target: { value: 1 } });
    fireEvent.change(screen.getByTestId("drop-select-page"), { target: { value: 1 } });

    await waitFor(() => expect(screen.getByTestId('proxima-pagina')).toBeInTheDocument());
    screen.getByTestId('proxima-pagina').click();

    await waitFor(() => expect(screen.getByTestId('volta-pagina')).toBeInTheDocument());
    screen.getByTestId('volta-pagina').click();

  })

  it("Deve abrir o modal", async () => {
    const screen = render(
      <ModalExportarRanque
        onClose={() => { }} />
    );

    await waitFor(() => expect(screen.getByTestId("table-row-eye-0")).toBeInTheDocument());
    screen.getByTestId("table-row-eye-0").click();
    await waitFor(() => expect(screen.getByText("Detalhes do Ranque")).toBeInTheDocument());
  })

  it("Deve carregar os ranques", async () => {
    const screen = render(
      <ModalExportarRanque
        onClose={() => { }} />
    );

    await waitFor(() => expect(screen.getByText("Carregando Tabela...")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("7777")).toBeInTheDocument());
  })

});
