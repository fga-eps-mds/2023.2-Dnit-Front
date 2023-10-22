import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import DragDrop from "../components/cadastrarEscolas/cadastroPlanilha/UploadPlanilha";
import { AuthProvider } from "../provider/Autenticacao";
import localStorageMock from "./mock/memoriaLocal";
import server from "./mock/servicosAPI";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";

beforeAll(() => {
  server.listen();
});
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

const escolasService = `${process.env.REACT_APP_API_ESCOLAS}/api`

test("Cadastro feito", async () => {
  autenticar(Permissao.EscolaCadastrar);
  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const inserirInformacoes = screen.getByText("Inserindo informações");
  fireEvent.click(inserirInformacoes);
  const nome = screen.getByLabelText("Nome da Escola");
  fireEvent.change(nome, { target: { value: "Escola A" } });

  const codigo = screen.getByLabelText("Codigo da Escola");
  fireEvent.change(codigo, { target: { value: "12309876" } });

  const rede = screen.getByLabelText("Rede");
  fireEvent.mouseDown(rede);
  const redeMunicipal = screen.getByText("Municipal");
  fireEvent.click(redeMunicipal);

  const cep = screen.getByLabelText("CEP");
  fireEvent.change(cep, { target: { value: "12345678" } });
  const telefone = screen.getByLabelText("Telefone");
  fireEvent.change(telefone, { target: { value: "1234567891" } });

  const etapas = screen.getByLabelText("Etapas de Ensino");
  fireEvent.mouseDown(etapas);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );
  const etapasSelecionada = screen.getByText("Educação Infantil");
  fireEvent.click(etapasSelecionada);

  const porte = screen.getByLabelText("Porte");
  fireEvent.mouseDown(porte);
  const porteSelecionado = screen.getByText(
    "Até 50 matrículas de escolarização"
  );
  fireEvent.click(porteSelecionado);

  const endereco = screen.getByLabelText("Endereço");
  fireEvent.change(endereco, { target: { value: "Rua Lebron JAMES" } });

  const local = screen.getByLabelText("Localização");
  fireEvent.mouseDown(local);
  const localSelecionado = screen.getByText("Rural");
  fireEvent.click(localSelecionado);

  const latitude = screen.getByLabelText("Latitude");
  fireEvent.change(latitude, { target: { value: "89" } });

  const longitude = screen.getByLabelText("Longitude");
  fireEvent.change(longitude, { target: { value: "123" } });

  const numeroAlunos = screen.getByLabelText("Número Total de Alunos");
  fireEvent.change(numeroAlunos, { target: { value: "123" } });

  const numeroDocentes = screen.getByLabelText("Número Total de Docentes");
  fireEvent.change(numeroDocentes, { target: { value: "123" } });

  const cadastrar = screen.getByText("Cadastrar");
  fireEvent.click(cadastrar);
});

test("Cadastro Sem Permissão", async () => {
  autenticar();

  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const cadastrar = await screen.queryByText("Cadastrar");
  expect(cadastrar).toBeNull();
});

test("Cadastro feito sem latitude e longitude", async () => {
  autenticar(Permissao.EscolaCadastrar);

  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const inserirInformacoes = screen.getByText("Inserindo informações");
  fireEvent.click(inserirInformacoes);
  const nome = screen.getByLabelText("Nome da Escola");
  fireEvent.change(nome, { target: { value: "Escola B" } });

  const codigo = screen.getByLabelText("Codigo da Escola");
  fireEvent.change(codigo, { target: { value: "12345678" } });

  const rede = screen.getByLabelText("Rede");
  fireEvent.mouseDown(rede);
  const redeMunicipal = screen.getByText("Municipal");
  fireEvent.click(redeMunicipal);

  const cep = screen.getByLabelText("CEP");
  fireEvent.change(cep, { target: { value: "12345678" } });
  const telefone = screen.getByLabelText("Telefone");
  fireEvent.change(telefone, { target: { value: "1234567891" } });

  const etapas = screen.getByLabelText("Etapas de Ensino");
  fireEvent.mouseDown(etapas);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );
  const etapasSelecionada = screen.getByText("Educação Infantil");
  fireEvent.click(etapasSelecionada);

  const porte = screen.getByLabelText("Porte");
  fireEvent.mouseDown(porte);
  const porteSelecionado = screen.getByText(
    "Até 50 matrículas de escolarização"
  );
  fireEvent.click(porteSelecionado);

  const endereco = screen.getByLabelText("Endereço");
  fireEvent.change(endereco, { target: { value: "Rua Lebron JAMES" } });

  const local = screen.getByLabelText("Localização");
  fireEvent.mouseDown(local);
  const localSelecionado = screen.getByText("Rural");
  fireEvent.click(localSelecionado);

  const numeroAlunos = screen.getByLabelText("Número Total de Alunos");
  fireEvent.change(numeroAlunos, { target: { value: "123" } });

  const numeroDocentes = screen.getByLabelText("Número Total de Docentes");
  fireEvent.change(numeroDocentes, { target: { value: "123" } });

  const cadastrar = screen.getByText("Cadastrar");
  fireEvent.click(cadastrar);
});

test("Erro no cadastro", async () => {
  autenticar(Permissao.EscolaCadastrar);

  server.use(
    rest.post(
      `${escolasService}/escolas/cadastrarEscola`,
      (req, res, ctx) => {
        return res(ctx.status(400));
      }
    )
  );

  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const inserirInformacoes = screen.getByText("Inserindo informações");
  fireEvent.click(inserirInformacoes);

  const nome = screen.getByLabelText("Nome da Escola");
  fireEvent.change(nome, { target: { value: "Escola B" } });

  const codigo = screen.getByLabelText("Codigo da Escola");
  fireEvent.change(codigo, { target: { value: "12345678" } });

  const rede = screen.getByLabelText("Rede");
  fireEvent.mouseDown(rede);
  const redeMunicipal = screen.getByText("Municipal");
  fireEvent.click(redeMunicipal);

  const cep = screen.getByLabelText("CEP");
  fireEvent.change(cep, { target: { value: "12345678" } });
  const telefone = screen.getByLabelText("Telefone");
  fireEvent.change(telefone, { target: { value: "1234567891" } });

  const etapas = screen.getByLabelText("Etapas de Ensino");
  fireEvent.mouseDown(etapas);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );
  const etapasSelecionada = screen.getByText("Educação Infantil");
  fireEvent.click(etapasSelecionada);

  const porte = screen.getByLabelText("Porte");
  fireEvent.mouseDown(porte);
  const porteSelecionado = screen.getByText(
    "Até 50 matrículas de escolarização"
  );
  fireEvent.click(porteSelecionado);

  const endereco = screen.getByLabelText("Endereço");
  fireEvent.change(endereco, { target: { value: "Rua Lebron JAMES" } });

  const local = screen.getByLabelText("Localização");
  fireEvent.mouseDown(local);
  const localSelecionado = screen.getByText("Rural");
  fireEvent.click(localSelecionado);

  const numeroAlunos = screen.getByLabelText("Número Total de Alunos");
  fireEvent.change(numeroAlunos, { target: { value: "123" } });

  const numeroDocentes = screen.getByLabelText("Número Total de Docentes");
  fireEvent.change(numeroDocentes, { target: { value: "123" } });

  const cadastrar = screen.getByText("Cadastrar");
  fireEvent.click(cadastrar);

  await screen.findByText("Erro ao fazer o cadastro");

  const voltar = screen.getByText("Voltar");
  fireEvent.click(voltar);
});

test("Erro no cep", async () => {
  autenticar(Permissao.EscolaCadastrar);

  server.use(
    rest.get("https://viacep.com.br/ws/12345678/json", (req, res, ctx) => {
      return res(ctx.json({ erro: true }));
    })
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const inserirInformacoes = screen.getByText("Inserindo informações");
  fireEvent.click(inserirInformacoes);

  const cep = screen.getByLabelText("CEP");
  fireEvent.change(cep, { target: { value: "1234567" } });

  const cepError = screen.getByLabelText("CEP");
  fireEvent.change(cepError, { target: { value: "12345678" } });

  const ufSelect = screen.getByLabelText("UF");
  fireEvent.mouseDown(ufSelect);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );
  const ufSelectValue = screen.getByText("Acre");
  fireEvent.click(ufSelectValue);

  const municipio = screen.getByLabelText("Município");
  fireEvent.mouseDown(municipio);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );
  const municipioValue = screen.getByText("Acrelândia");
  fireEvent.click(municipioValue);

  const nome = screen.getByLabelText("Nome da Escola");
  fireEvent.change(nome, { target: { value: "Escola A" } });

  const codigo = screen.getByLabelText("Codigo da Escola");
  fireEvent.change(codigo, { target: { value: "12309876" } });

  const rede = screen.getByLabelText("Rede");
  fireEvent.mouseDown(rede);
  const redeMunicipal = screen.getByText("Municipal");
  fireEvent.click(redeMunicipal);

  const telefone = screen.getByLabelText("Telefone");
  fireEvent.change(telefone, { target: { value: "1234567891" } });

  const etapas = screen.getByLabelText("Etapas de Ensino");
  fireEvent.mouseDown(etapas);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );
  const etapasSelecionada = screen.getByText("Educação Infantil");
  fireEvent.click(etapasSelecionada);

  const porte = screen.getByLabelText("Porte");
  fireEvent.mouseDown(porte);
  const porteSelecionado = screen.getByText(
    "Até 50 matrículas de escolarização"
  );
  fireEvent.click(porteSelecionado);

  const endereco = screen.getByLabelText("Endereço");
  fireEvent.change(endereco, { target: { value: "Rua Lebron JAMES" } });

  const local = screen.getByLabelText("Localização");
  fireEvent.mouseDown(local);
  const localSelecionado = screen.getByText("Rural");
  fireEvent.click(localSelecionado);

  const latitude = screen.getByLabelText("Latitude");
  fireEvent.change(latitude, { target: { value: "89" } });

  const longitude = screen.getByLabelText("Longitude");
  fireEvent.change(longitude, { target: { value: "123" } });

  const numeroAlunos = screen.getByLabelText("Número Total de Alunos");
  fireEvent.change(numeroAlunos, { target: { value: "123" } });

  const numeroDocentes = screen.getByLabelText("Número Total de Docentes");
  fireEvent.change(numeroDocentes, { target: { value: "123" } });

  const cadastrar = screen.getByText("Cadastrar");
  fireEvent.click(cadastrar);
});

test("Lista de escolas redireciona pra listagem", async () => {
  autenticar(Permissao.EscolaCadastrar);

  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const inserirInformacoes = screen.getByTestId("redirecionar");
  fireEvent.click(inserirInformacoes);
});

test("Cadastro CSV", async () => {
  autenticar(Permissao.EscolaCadastrar);

  server.use(
    rest.post(
      `${escolasService}/escolas/cadastrarEscolaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.status(200));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const arquivo = screen.getByText("Utilizando Arquivo CSV");
  fireEvent.click(arquivo);

  const file = new File(["file content"], "file.csv", { type: "text/csv" });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [file] } });

  await screen.findByText("file.csv");

  const enviarButton = screen.getByText("Enviar arquivo");
  fireEvent.click(enviarButton);

  await screen.findByText("Inserção de arquivos concluída com sucesso");

  const concluir = screen.getByText("Concluir");
  fireEvent.click(concluir);
});

test("Cadastro CSV 2", async () => {
  autenticar(Permissao.EscolaCadastrar);

  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const arquivo = screen.getByText("Utilizando Arquivo CSV");
  fireEvent.click(arquivo);

  const file = new File(["file content"], "file.csv", { type: "text/csv" });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [file] } });

  await screen.findByText("file.csv");

  const enviarButton = screen.getByText("Enviar arquivo");
  fireEvent.click(enviarButton);

  await screen.findByText("Apenas as escolas abaixo foram adicionadas:");

  const concluir = screen.getByText("Concluir");
  fireEvent.click(concluir);
});

test("Cadastro CSV 3", async () => {
  autenticar(Permissao.EscolaCadastrar);

  server.use(
    rest.post(
      `${escolasService}/escolas/cadastrarEscolaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.json([1, 2, 3, 4, 5, 6, 7]));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const arquivo = screen.getByText("Utilizando Arquivo CSV");
  fireEvent.click(arquivo);

  const file = new File(["file content"], "file.csv", { type: "text/csv" });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [file] } });

  await screen.findByText("file.csv");

  const enviarButton = screen.getByText("Enviar arquivo");
  fireEvent.click(enviarButton);

  await screen.findByText("Inserção de arquivos concluída com sucesso");

  const concluir = screen.getByText("Concluir");
  fireEvent.click(concluir);
});

test("Cadastro CSV erro", async () => {
  autenticar(Permissao.EscolaCadastrar);

  server.use(
    rest.post(
      `${escolasService}/escolas/cadastrarEscolaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.status(406));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const arquivo = screen.getByText("Utilizando Arquivo CSV");
  fireEvent.click(arquivo);

  const file = new File(["file content"], "file.csv", { type: "text/csv" });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [file] } });

  await screen.findByText("file.csv");

  const enviarButton = screen.getByText("Enviar arquivo");
  fireEvent.click(enviarButton);
  await screen.findByText("Erro na inserção das escolas!");

  const concluir = screen.getByText("Concluir");
  fireEvent.click(concluir);
});

test("Cadastro CSV vazio", async () => {
  autenticar(Permissao.EscolaCadastrar);

  server.use(
    rest.post(
      `${escolasService}/escolas/cadastrarEscolaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.json("Nenhum arquivo enviado."), ctx.status(400));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const arquivo = screen.getByText("Utilizando Arquivo CSV");
  fireEvent.click(arquivo);

  const file = new File(["file content"], "file.csv", { type: "text/csv" });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [file] } });

  await screen.findByText("file.csv");

  const enviarButton = screen.getByText("Enviar arquivo");
  fireEvent.click(enviarButton);
  await screen.findByText("Nenhum arquivo enviado.");
});

test("Cadastro sem enviar CSV", async () => {
  autenticar(Permissao.EscolaCadastrar);

  server.use(
    rest.post(
      `${escolasService}/escolas/cadastrarescolaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.json([]));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarescola"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const arquivo = screen.getByText("Utilizando Arquivo CSV");
  fireEvent.click(arquivo);

  const enviarButton = screen.getByText("Enviar arquivo");
  fireEvent.click(enviarButton);

  await screen.findByText("Nenhum arquivo carregado.");

  const cancelar = screen.getByText("Cancelar");
  fireEvent.click(cancelar);
});

test("Sem o provider", async () => {
  autenticar(Permissao.EscolaCadastrar);

  expect(() =>
    render(
      <DragDrop
        onClickAceito={() => {}}
        onClickBack={() => {}}
        onClickError={() => {}}
        onClickErroJaCadastrada={() => {}}
      />
    )
  ).toThrow(
    new Error(
      "useEscolasCadastradas must be used within a EscolasCadastradasProvider"
    )
  );
});
