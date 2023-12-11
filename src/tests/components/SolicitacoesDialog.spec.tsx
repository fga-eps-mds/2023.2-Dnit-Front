import { render, fireEvent, queryByText, waitFor } from "@testing-library/react";
import SolicitacoesDialog from "../../components/SolicitacoesDialog";
import { solicitacao, solicitacaoSemEscola } from "../stub/solicitacaoAcao";

afterEach(jest.clearAllMocks);

describe("Testes para o componente SolicitacoesDialog", () => {
  test("Deve renderizar o componente", () => {
    const screen = render(
      <SolicitacoesDialog
        onClose={() => { }}
        onCreateAcao={() => { }}
        escolaSelecionada={solicitacaoSemEscola}
      />
    )
    expect(screen.getByText("Detalhes da Solicitação")).toBeInTheDocument();

    const modalContent = screen.getByTestId('overlay');
    fireEvent.click(modalContent);
  })
  test("Deve carregar o conteudo do Componente", async () => {
    const screen = render(
      <SolicitacoesDialog
        onClose={() => { }}
        onCreateAcao={() => { }}
        escolaSelecionada={solicitacao}
      />
    )

    await waitFor(() => expect(screen.getByText("Alunos: 200")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Endereco: RUA JOAO BATISTA SCUCATO, 80 ATUBA. 82860-130 Curitiba - PR.")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Estado: AC")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Telefone: (75) 3344-5566")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Observações: Preciso de uma visita. Existem muito acidentes")).toBeInTheDocument());

  })
  test("Deve Fechar o componente ao clickar em Fechar", () => {
    const closeMock = jest.fn();

    const screen = render(
      <SolicitacoesDialog
        onClose={closeMock}
        onCreateAcao={() => { }}
        escolaSelecionada={solicitacao}
      />
    )

    const botao = screen.getByTestId("botaoFechar");
    fireEvent.click(botao);

    expect(closeMock).toHaveBeenCalled();
  })
  test('Deve mostrar o loading', () => {
    const screen = render(
      <SolicitacoesDialog
        escolaSelecionada={undefined}
        onClose={() => { }}
        onCreateAcao={() => { }}
      />);

    expect(screen.getByText(/Carregando Escola.../i)).toBeInTheDocument();

    const modalContent = screen.getByTestId('overlay');
    fireEvent.click(modalContent);


  });
  test('Deve desabilitar o botão de Criar Ação', () => {
    const createMock = jest.fn();
    const screen = render(
      <SolicitacoesDialog
        escolaSelecionada={solicitacao}
        onClose={() => { }}
        onCreateAcao={createMock}
      />);

    const botaoCriar = screen.getByTestId('botaoCriar');

    expect(botaoCriar).toBeInTheDocument();

    fireEvent.mouseOver(botaoCriar)
    expect(botaoCriar).toBeDisabled();
    fireEvent.click(botaoCriar)
    expect(botaoCriar).toBeDisabled();

    expect(createMock).not.toHaveBeenCalled();
  });
})