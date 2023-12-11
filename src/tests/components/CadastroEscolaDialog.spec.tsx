import { render, fireEvent, queryByText, waitFor } from "@testing-library/react";
import { CadastroEscolaDialog } from "../../components/CadastroEscolaDialog";
import { solicitacao, solicitacaoSemEscola } from "../stub/solicitacaoAcao";
import server from "../mock/servicosAPI";
import { wait } from "@testing-library/user-event/dist/utils";


beforeAll(() => server.listen());

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
})

afterAll(() => server.close());

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks;
});

describe("Testes para o componente CadastroEscolaDialog", () => {
  test("Deve renderizar o componente", async () => {
    const screen = render(
      <CadastroEscolaDialog
        closeDialog={() => { }}
        dadosSoliciatacao={solicitacao}
      />
    )
    await expect(screen.getByText("Cadastrar Escola")).toBeInTheDocument();

    const modalContent = screen.getByTestId('overlay');
    fireEvent.mouseDown(modalContent);
  })
  test("Deve fechar o componente", () => {
    const closeMock = jest.fn();

    const screen = render(
      <CadastroEscolaDialog
        closeDialog={closeMock}
        dadosSoliciatacao={solicitacao}
      />
    )

    const cadastrar = screen.getByText("Cancelar");
    fireEvent.click(cadastrar);

    expect(closeMock).toHaveBeenCalled();

  })
  test("Deve preencher os formulario manualmente", async () => {
    const closeMock = jest.fn();

    const screen = render(
      <CadastroEscolaDialog
        closeDialog={closeMock}
        dadosSoliciatacao={solicitacao}
      />
    )
    await expect(screen.getByText("Cadastrar Escola")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByDisplayValue("ESCOLA A")).toBeInTheDocument);

    const redeDropDwn = screen.getByLabelText("Rede");;
    fireEvent.mouseDown(redeDropDwn);

    const option = screen.getByText("Municipal");
    fireEvent.click(option);

    const codigo = screen.getByLabelText("Codigo da Escola");
    fireEvent.change(codigo, { target: { value: "12309876" } });

    const cep = screen.getByLabelText("CEP");
    fireEvent.change(cep, { target: { value: "12345678" } });

    const endereco = screen.getByLabelText("Endereço");
    fireEvent.change(endereco, { target: { value: "Rua Lebron JAMES" } });

    const telefone = screen.getByLabelText("Telefone");
    fireEvent.change(telefone, { target: { value: "1234567891" } });

    const etapas = screen.getByLabelText("Etapas de Ensino");
    fireEvent.mouseDown(etapas);

    await waitFor(() => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument());

    const etapasSelecionada = screen.getByText("Educação Infantil");
    fireEvent.click(etapasSelecionada);

    const porte = screen.getByLabelText("Porte");
    fireEvent.mouseDown(porte);

    const porteSelecionado = screen.getByText("Até 50 matrículas de escolarização");
    fireEvent.click(porteSelecionado);

    const local = screen.getByLabelText("Localização");
    fireEvent.mouseDown(local);
    const localSelecionado = screen.getByText("Urbana");
    fireEvent.click(localSelecionado)

    const latitude = screen.getByLabelText("Latitude");
    fireEvent.change(latitude, { target: { value: "-15.88431" } });

    const longitude = screen.getByLabelText("Longitude");
    fireEvent.change(longitude, { target: { value: "-48.08813" } });

    const numeroAlunos = screen.getByLabelText("Número Total de Alunos");
    fireEvent.change(numeroAlunos, { target: { value: "123" } });

    const numeroDocentes = screen.getByLabelText("Número Total de Docentes");
    fireEvent.change(numeroDocentes, { target: { value: "123" } });

    const cadastrar = screen.getByText("Cadastrar");
    fireEvent.click(cadastrar);
    expect(closeMock).not.toHaveBeenCalled();

  });
  test('Deve fazer cadastro com lat e lonj vazios', async () => {
    const closeMock = jest.fn();

    const screen = render(
      <CadastroEscolaDialog
        closeDialog={closeMock}
        dadosSoliciatacao={solicitacao}
      />
    )
    await expect(screen.getByText("Cadastrar Escola")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByDisplayValue("ESCOLA A")).toBeInTheDocument);

    const redeDropDwn = screen.getByLabelText("Rede");
    fireEvent.mouseDown(redeDropDwn);

    const option = screen.getByText("Municipal");
    fireEvent.click(option);

    const codigo = screen.getByLabelText("Codigo da Escola");
    fireEvent.change(codigo, { target: { value: "12309876" } });

    const cep = screen.getByLabelText("CEP");
    fireEvent.change(cep, { target: { value: "12345678" } });

    const endereco = screen.getByLabelText("Endereço");
    fireEvent.change(endereco, { target: { value: "Rua Lebron JAMES" } });

    const telefone = screen.getByLabelText("Telefone");
    fireEvent.change(telefone, { target: { value: "1234567891" } });

    const etapas = screen.getByLabelText("Etapas de Ensino");
    fireEvent.mouseDown(etapas);

    await waitFor(() => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument());

    const etapasSelecionada = screen.getByText("Educação Infantil");
    fireEvent.click(etapasSelecionada);

    const porte = screen.getByLabelText("Porte");
    fireEvent.mouseDown(porte);

    const porteSelecionado = screen.getByText("Até 50 matrículas de escolarização");
    fireEvent.click(porteSelecionado);

    const local = screen.getByLabelText("Localização");
    fireEvent.mouseDown(local);
    const localSelecionado = screen.getByText("Urbana");
    fireEvent.click(localSelecionado)

    //Não envia latitude no formulário

    const numeroAlunos = screen.getByLabelText("Número Total de Alunos");
    fireEvent.change(numeroAlunos, { target: { value: "123" } });

    const numeroDocentes = screen.getByLabelText("Número Total de Docentes");
    fireEvent.change(numeroDocentes, { target: { value: "123" } });

    const cadastrar = screen.getByText("Cadastrar");
    fireEvent.click(cadastrar);
    expect(closeMock).not.toHaveBeenCalled();

  });
  test('Deve testar o parser de Latitude e Longitude', async () => {
    const screen = render(
      <CadastroEscolaDialog
        closeDialog={() => { }}
        dadosSoliciatacao={solicitacao}
      />
    );

    await waitFor(() => expect(screen.getByText("Cadastrar Escola")).toBeInTheDocument());

    const latitude = screen.getByLabelText("Latitude");
    fireEvent.paste(latitude, { clipboardData: { getData: () => "-15.758173462592291, -47.90013307875956" } });

    await waitFor(() => {
      const updatedLatitude = screen.getByDisplayValue("-15.75817346");
      expect(updatedLatitude).toBeInTheDocument();
    });
  });

  test('Deve clicar nos drodowns de uf e municipio', async () => {
    const screen = render(
      <CadastroEscolaDialog
        closeDialog={() => { }}
        dadosSoliciatacao={solicitacao}
      />);


    await expect(screen.getByText("Cadastrar Escola")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByDisplayValue("ESCOLA A")).toBeInTheDocument);

    const ufSelect = screen.getByLabelText("UF");
    fireEvent.mouseDown(ufSelect);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const ufSelectValue = screen.getByText("DF");
    fireEvent.click(ufSelectValue);

    const municipio = screen.getByLabelText("Município");
    fireEvent.mouseDown(municipio);
    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );
    const muncipioOption = await screen.findAllByText("Brasília");
    const municipioValue = muncipioOption[2];
    fireEvent.click(municipioValue);
  });
})