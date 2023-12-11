/* eslint-disable testing-library/render-result-naming-convention */
import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../App";
import { AuthProvider, temPermissao } from "../provider/Autenticacao";
import localStorageMock from "./mock/memoriaLocal";
import { autenticar } from "./mock/autenticacao";
import { Permissao } from "../models/auth";
import server from "./mock/servicosAPI";

beforeAll(() => server.listen());

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
});

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

describe("Testes do dashboard", () => {
  test("Visualizar Escolas", async () => {
    autenticar(Permissao.EscolaVisualizar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const escolas = screen.getAllByText("Visualizar Escolas");
    fireEvent.click(escolas[0]);
  });

  test("Visualizar Escolas Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = await screen.queryByTestId("visualizar-escola-option");
    expect(botao).toBeNull();
  });


  test("Visualizar Ranque", async () => {
    autenticar(Permissao.RanqueVisualizar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const ups = screen.getByText("Ranking de escolas");
    fireEvent.click(ups);
  });

  test("Visualizar Dados UPS Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Visualizar Dados UPS");
    expect(botao).toBeNull();
  });

  test("Visualisar Solicitações", async () => {
    autenticar(Permissao.SolicitacaoVisualizar);
    
    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const escolas = screen.getByText("Solicitações");
    fireEvent.click(escolas);
  })

  test("Visualisar Solicitações sem Permissão", async () => {
    autenticar();
    
    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Solicitações");
    expect(botao).toBeNull();
  })

  test("Cadastrar Escolas", async () => {
    autenticar(Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const escolas = screen.getByText("Cadastrar Escolas");
    fireEvent.click(escolas);
  });

  test("Cadastrar Escolas Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Cadastrar Escolas");
    expect(botao).toBeNull();
  });

  test("Adicionar Sinistros", async () => {
    autenticar(Permissao.SinistroCadastrar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const sinistros = screen.getByText("Adicionar Sinistros");
    fireEvent.click(sinistros);
  });

  test("Adicionar Sinistros Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Adicionar Sinistros");
    expect(botao).toBeNull();
  });

  test("Adicionar Rodovias", async () => {
    autenticar(Permissao.RodoviaCadastrar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const rodovias = screen.getByText("Adicionar Rodovias");
    fireEvent.click(rodovias);
  });

  test("Adicionar Rodovias Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Adicionar Rodovias");
    expect(botao).toBeNull();
  });

  test("Gerenciar Usuarios", async () => {
    autenticar(Permissao.UsuarioVisualizar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const rodovias = screen.getByText("Gerenciar Usuário");
    fireEvent.click(rodovias);
  });

  test("Gerenciar Usuarios Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Gerenciar Usuário");
    expect(botao).toBeNull();
  });

  test("Gerenciar Perfis", async () => {
    autenticar(Permissao.PerfilVisualizar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const rodovias = screen.getByText("Gerenciar Perfis");
    fireEvent.click(rodovias);
  });

  test("Gerenciar Perfis Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Gerenciar Perfis");
    expect(botao).toBeNull();
  });

  test("Gerenciar Polos", async () => {
    autenticar(Permissao.PoloVisualizar);

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.getByText("Gerenciar Polos");
    fireEvent.click(botao);
  });

  test("Gerenciar Polos Sem Permissão", async () => {
    autenticar();

    const screen = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Gerenciar Polos");
    expect(botao).toBeNull();
  });
});
