import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../provider/Autenticacao";
import localStorageMock from "./mock/memoriaLocal";
import server from "./mock/servicosAPI";
import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";

autenticar(Permissao.RodoviaCadastrar);


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

const upsService = `${process.env.REACT_APP_API_UPS}/api`

test("Cadastro via CSV", async () => {
  autenticar(Permissao.RodoviaCadastrar);

  server.use(
    rest.post(
      `${upsService}/rodovia/cadastrarRodoviaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.status(200));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarRodovias"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  const arquivo = new File(["file content"], "arquivo.csv", {
    type: "text/csv",
  });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [arquivo] } });

  await screen.findByText("arquivo.csv");

  const botaoEnviar = screen.getByText("Enviar Arquivo");
  fireEvent.click(botaoEnviar);

  await screen.findByText("Inserção de arquivos concluída com sucesso");

  const botaoConcluir = screen.getByText("Concluir");
  fireEvent.click(botaoConcluir);
});

test("Cadastro Sem Permissão", async () => {
  autenticar();

  render(
    <MemoryRouter initialEntries={["/cadastrarRodovias"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const botao = await screen.queryByText("Concluir");
  expect(botao).toBeNull();
});

test("Cadastro CSV erro", async () => {
  autenticar(Permissao.RodoviaCadastrar);


  server.use(
    rest.post(
      `${upsService}/rodovia/cadastrarRodoviaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.status(406));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarRodovias"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  const arquivo = new File(["file content"], "arquivo.csv", {
    type: "text/csv",
  });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [arquivo] } });

  await screen.findByText("arquivo.csv");

  const botaoEnviar = screen.getByText("Enviar Arquivo");
  fireEvent.click(botaoEnviar);
  await screen.findByText("Erro na inserção das rodovias!");

  const concluir = screen.getByText("Concluir");
  fireEvent.click(concluir);
});

test("Cadastro CSV vazio", async () => {
  autenticar(Permissao.RodoviaCadastrar);


  server.use(
    rest.post(
      `${upsService}/rodovia/cadastrarRodoviaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.status(400), ctx.json("Nenhum arquivo enviado."));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarRodovias"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  const file = new File(["file content"], "file.csv", { type: "text/csv" });
  const dragDropContainer = screen.getByTestId("drag-drop-container");
  fireEvent.change(dragDropContainer, { target: { files: [file] } });

  await screen.findByText("file.csv");

  const enviarButton = screen.getByText("Enviar Arquivo");
  fireEvent.click(enviarButton);

  await screen.findByText("Nenhum arquivo enviado.");
});

test("Cadastro sem enviar CSV", async () => {
  autenticar(Permissao.RodoviaCadastrar);


  server.use(
    rest.post(
      `${upsService}/rodovia/cadastrarRodoviaPlanilha`,
      (req, res, ctx) => {
        return res(ctx.json([]));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/cadastrarRodovias"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  const enviarButton = screen.getByText("Enviar Arquivo");
  fireEvent.click(enviarButton);

  await screen.findByText("Nenhum arquivo carregado.");

  const cancelar = screen.getByText("Cancelar");
  fireEvent.click(cancelar);
});
