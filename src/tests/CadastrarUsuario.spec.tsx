/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../provider/Autenticacao";
import {
  sendCadastroUsuarioDnit,
  sendCadastroUsuarioTerceiro,
} from "../service/usuarioApi";
import server from "./mock/servicosAPI";
import { ExcessoesApi } from "../service/excessoes";
import { fetchMunicipio } from "../service/escolaApi";
import { fetchListaEmpresas } from "../service/empresaApi";

jest.mock("../service/usuarioApi", () => ({
  ...jest.requireActual("../service/usuarioApi"),
  sendCadastroUsuarioDnit: jest.fn(),
  sendCadastroUsuarioTerceiro: jest.fn(),
}));

jest.mock("../service/escolaApi", () => ({
  ...jest.requireActual("../service/escolaApi"),
  fetchMunicipio: jest.fn(),
}));

jest.mock("../service/empresaApi.ts", () => ({
  ...jest.requireActual("../service/empresaApi"),
  fetchListaEmpresas: jest.fn(),
}));

const mockedUseRegister = sendCadastroUsuarioDnit as jest.Mock;
const mockedFetchMunicipio = fetchMunicipio as jest.Mock;
const mockedFetchListaEmpresas = fetchListaEmpresas as jest.Mock;
const mockedSendCadastroUsuarioTerceiro =
  sendCadastroUsuarioTerceiro as jest.Mock;

beforeAll(() => server.listen());
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

test("should render Register", async () => {
  mockedUseRegister.mockResolvedValueOnce({ success: true });

  mockedFetchMunicipio.mockResolvedValue([{ id: 1, nome: "Acrelandia" }]);

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const screen = render(
    <MemoryRouter initialEntries={["/cadastro"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText("E-mail Institucional");
  const passwordInput = screen.getByLabelText("Senha");
  const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
  const nomeInput = screen.getByLabelText("Nome Completo");
  const usuarioDnitRadioButton = screen.getByRole("radio", {
    name: "Usuário DNIT",
  });
  const button = screen.getByText("Cadastrar-se");

  fireEvent.change(emailInput, { target: { value: "example@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: "password123" },
  });
  fireEvent.change(nomeInput, { target: { value: "Example" } });
  fireEvent.click(usuarioDnitRadioButton);

  const ufSelect = screen.getByRole("combobox");
  fireEvent.mouseDown(ufSelect);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  const ufSelectValue = screen.getByText("Acre");
  fireEvent.click(ufSelectValue);

  const options = screen.getByTestId("option-1");
  fireEvent.click(options);

  const municipioDropdown = screen.getByRole("combobox", {
    name: "Município",
  });
  fireEvent.mouseDown(municipioDropdown);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  act(() => {
    const municipioSelectedValue = screen.getByText("Acrelandia");
    fireEvent.click(municipioSelectedValue);

    const municipioOption = screen.getAllByTestId("option-municipio")[0];
    fireEvent.click(municipioOption);
  });

  fireEvent.click(button);

  await waitFor(() => expect(mockedUseRegister).toHaveBeenCalledTimes(1));
});

test("should render error in Register form", async () => {
  const screen = render(
    <MemoryRouter initialEntries={["/cadastro"]}>
      <App />
    </MemoryRouter>
  );

  await act(async () => {
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password12" },
    });

    const usuarioDnitRadioButton = screen.getByRole("radio", {
      name: "Empresa Executora",
    });
    fireEvent.click(usuarioDnitRadioButton);
  });
});

test("should render error in the Register form when it exists", async () => {
  const mockedError = new ExcessoesApi("409", "Email já cadastrado", {
    "1": "null",
  });
  mockedUseRegister.mockImplementation(() => Promise.reject(mockedError));
  mockedFetchMunicipio.mockResolvedValue([{ id: 1, nome: "Acrelandia" }]);
  mockedFetchListaEmpresas.mockResolvedValue([
    { cnpj: "123456789", razaoSocial: "EmpresaAB", uFs: [] },
  ]);

  const screen = render(
    <MemoryRouter initialEntries={["/cadastro"]}>
      <App />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText("E-mail Institucional");
  const passwordInput = screen.getByLabelText("Senha");
  const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
  const nomeInput = screen.getByLabelText("Nome Completo");
  const usuarioDnitRadioButton = screen.getByRole("radio", {
    name: "Usuário DNIT",
  });
  const button = screen.getByText("Cadastrar-se");

  fireEvent.change(emailInput, { target: { value: "example@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: "password123" },
  });
  fireEvent.change(nomeInput, { target: { value: "Example" } });
  fireEvent.click(usuarioDnitRadioButton);

  const ufSelect = screen.getByRole("combobox");
  fireEvent.mouseDown(ufSelect);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  const ufSelectValue = screen.getByText("Acre");
  fireEvent.click(ufSelectValue);

  const options = screen.getByTestId("option-1");
  fireEvent.click(options);

  const municipioDropdown = screen.getByRole("combobox", {
    name: "Município",
  });
  fireEvent.mouseDown(municipioDropdown);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  act(() => {
    const municipioSelectedValue = screen.getByText("Acrelandia");
    fireEvent.click(municipioSelectedValue);

    const municipioOption = screen.getAllByTestId("option-municipio")[0];
    fireEvent.click(municipioOption);
  });

  fireEvent.click(button);

  await waitFor(() =>
    expect(screen.getByText("Email já cadastrado")).toBeInTheDocument()
  );
});

test("should render error in the Register form when it exists", async () => {
  const mockedError = new Error("Erro interno");
  mockedUseRegister.mockImplementation(() => Promise.reject(mockedError));
  mockedFetchMunicipio.mockResolvedValue([{ id: 1, nome: "Acrelandia" }]);

  const screen = render(
    <MemoryRouter initialEntries={["/cadastro"]}>
      <App />
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText("E-mail Institucional");
  const passwordInput = screen.getByLabelText("Senha");
  const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
  const nomeInput = screen.getByLabelText("Nome Completo");
  const usuarioDnitRadioButton = screen.getByRole("radio", {
    name: "Usuário DNIT",
  });
  const button = screen.getByText("Cadastrar-se");

  fireEvent.change(emailInput, { target: { value: "example@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: "password123" },
  });
  fireEvent.change(nomeInput, { target: { value: "Example" } });
  fireEvent.click(usuarioDnitRadioButton);

  const ufSelect = screen.getByRole("combobox");
  fireEvent.mouseDown(ufSelect);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  const ufSelectValue = screen.getByText("Acre");
  fireEvent.click(ufSelectValue);

  const options = screen.getByTestId("option-1");
  fireEvent.click(options);

  const municipioDropdown = screen.getByRole("combobox", {
    name: "Município",
  });
  fireEvent.mouseDown(municipioDropdown);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  act(() => {
    const municipioSelectedValue = screen.getByText("Acrelandia");
    fireEvent.click(municipioSelectedValue);

    const municipioOption = screen.getAllByTestId("option-municipio")[0];
    fireEvent.click(municipioOption);
  });

  fireEvent.click(button);

  await waitFor(() =>
    expect(screen.getByText("Erro interno")).toBeInTheDocument()
  );
});

test("should register third party user", async () => {
  mockedUseRegister.mockResolvedValueOnce({ success: true });
  mockedSendCadastroUsuarioTerceiro.mockResolvedValueOnce({ success: true });

  mockedFetchMunicipio.mockResolvedValue([{ id: 1, nome: "Acrelandia" }]);

  mockedFetchListaEmpresas.mockResolvedValue([
    { cnpj: "123456789", razaoSocial: "EmpresaAB", uFs: [] },
  ]);

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const screen = render(
    <MemoryRouter initialEntries={["/cadastro"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );

  const emailInput = screen.getByLabelText("E-mail Institucional");
  const passwordInput = screen.getByLabelText("Senha");
  const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
  const nomeInput = screen.getByLabelText("Nome Completo");
  const usuarioDnitRadioButton = screen.getByRole("radio", {
    name: "Empresa Executora",
  });
  const button = screen.getByText("Cadastrar-se");

  fireEvent.change(emailInput, { target: { value: "example@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: "password123" },
  });
  fireEvent.change(nomeInput, { target: { value: "Example" } });
  fireEvent.click(usuarioDnitRadioButton);

  const ufSelect = screen.getAllByRole("combobox")[0];
  fireEvent.mouseDown(ufSelect);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  const ufSelectValue = screen.getByText("Acre");
  fireEvent.click(ufSelectValue);

  const options = screen.getByTestId("option-1");
  fireEvent.click(options);

  const municipioDropdown = screen.getByRole("combobox", {
    name: "Município",
  });
  fireEvent.mouseDown(municipioDropdown);

  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  act(() => {
    const municipioSelectedValue = screen.getByText("Acrelandia");
    fireEvent.click(municipioSelectedValue);

    const municipioOption = screen.getAllByTestId("option-municipio")[0];
    fireEvent.click(municipioOption);
  });

  const empresaAutocomplete = screen.getByRole("combobox", {
    name: "",
  });
  fireEvent.mouseDown(empresaAutocomplete);

  act(() => {
    const empresaSelected = screen.getByText("EmpresaAB");
    fireEvent.click(empresaSelected);
  });

  fireEvent.click(button);

  await waitFor(() =>
    expect(mockedSendCadastroUsuarioTerceiro).toHaveBeenCalledTimes(1)
  );
});
