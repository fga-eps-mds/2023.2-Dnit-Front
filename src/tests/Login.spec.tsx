/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { fireEvent, render, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthLocalStorage, AuthProvider, atualizarToken, getPermissoes, removerLogin, salvarLogin, setPermissoes, temPermissao } from "../provider/Autenticacao";
import fetchLogin from "../service/login";
import { LoginResponse, Permissao } from "../models/auth";

jest.mock("../service/login", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedUseLogin = fetchLogin as jest.Mock;

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

describe("Login tests", () => {
  it("should render Login", async () => {
    mockedUseLogin.mockResolvedValueOnce({ success: true });

    const screen = render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    await act(async () => {
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Senha");
      const entrarButton = screen.getByText("Entrar");

      fireEvent.change(emailInput, { target: { value: "dora@gmail.com" } });
      fireEvent.change(passwordInput, { target: { value: "123456" } });
      fireEvent.click(entrarButton);
    });

    await waitFor(() => expect(mockedUseLogin).toHaveBeenCalledTimes(1));
  });
});

test("Home", async () => {
  const screen = render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  const home = screen.getByTestId("redirecionar");
  fireEvent.click(home);
});

test("O login deve ser salvo", () => {
  const login: LoginResponse = {
    token: 'token',
    tokenAtualizacao: 'token atualizacao',
    expiraEm: new Date().toISOString(),
    permissoes: [Permissao.EscolaCadastrar, Permissao.EscolaVisualizar]
  };
  salvarLogin(login);

  expect(getPermissoes().length).toBeGreaterThan(0);
  expect(temPermissao(Permissao.EscolaCadastrar)).toBeTruthy();
  expect(temPermissao(Permissao.RodoviaCadastrar)).not.toBeTruthy();
});

test("A permissão deve existir", () => {
  setPermissoes([Permissao.EscolaCadastrar]);
  expect(temPermissao(Permissao.EscolaCadastrar)).toBeTruthy();
});

test("A permissão não deve existir", () => {
  setPermissoes([Permissao.EscolaCadastrar]);
  expect(temPermissao(Permissao.EscolaEditar)).not.toBeTruthy();
});

test("O login deve ser removido", () => {
  removerLogin();
  expect(localStorage.getItem(AuthLocalStorage.Token)).toBeNull();
});

test("Atualiza o token", () => {
  const login: LoginResponse = {
    token: 'token',
    tokenAtualizacao: 'token atualizacao',
    expiraEm: new Date().toISOString(),
    permissoes: [Permissao.EscolaCadastrar, Permissao.EscolaVisualizar]
  };
  salvarLogin(login);
  atualizarToken();

  expect(localStorage.getItem(AuthLocalStorage.Token)).not.toBeNull();
  expect(temPermissao(Permissao.EscolaCadastrar)).toBeTruthy();
})