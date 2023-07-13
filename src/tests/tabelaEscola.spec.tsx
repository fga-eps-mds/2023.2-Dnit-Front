import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import server from "./mock/service";

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

test("Lista de escolas é exibida corretamente", async () => {
  const response = await fetch("https://api.aprovaunb.com/api/usuario/login", {
    method: "POST",
  });
  expect(response.status).toEqual(200);

  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    const escolas = screen.getAllByTestId("linha-escola");
    expect(escolas).toHaveLength(3);
  });
});

test("Filtragem de escolas", async () => {
  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    const escolas = screen.getAllByTestId("linha-escola");
    expect(escolas).toHaveLength(3);
  });

  const filtrarNome = screen.getByLabelText("Nome");
  fireEvent.change(filtrarNome, { target: { value: "Escola A" } });
  const buscarNome = screen.getByTestId("buscar-nome");
  fireEvent.click(buscarNome);

  const filtrarUF = screen.getByTestId("buscar-uf");
  fireEvent.click(filtrarUF);
  const buscarUF = screen.getByText("Acre");
  fireEvent.click(buscarUF);
  fireEvent.click(filtrarUF);
  const buscarUFTodas = screen.getAllByText("Todas");
  fireEvent.click(buscarUFTodas[0]);

  const filtrarMunicipio = screen.getByTestId("buscar-municipio");
  fireEvent.click(filtrarMunicipio);
  const buscarMunicipio = await screen.findByText("Acrelândia");
  fireEvent.click(buscarMunicipio);
  fireEvent.click(filtrarMunicipio);
  const buscarMunicipioTodos = screen.getByText("Todos");
  fireEvent.click(buscarMunicipioTodos);

  const filtrarSituacao = screen.getByTestId("buscar-situacao");
  fireEvent.click(filtrarSituacao);
  const buscarSituacao = screen.getByText("Indicação");
  fireEvent.click(buscarSituacao);
  fireEvent.click(filtrarSituacao);
  const buscarSituacaoTodas = screen.getAllByText("Todas");
  fireEvent.click(buscarSituacaoTodas[0]);

  const etapas = screen.getByRole("combobox");
  userEvent.click(etapas);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  screen.debug(etapas);
  const etapasSelecionada = screen.getByText("Educação Infantil");
  fireEvent.click(etapasSelecionada);
});

test("Clicar em Cadastrar escola", async () => {
  const response = await fetch("https://api.aprovaunb.com/api/usuario/login", {
    method: "POST",
  });
  expect(response.status).toEqual(200);
  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <App />
    </MemoryRouter>
  );

  const cadastrar = screen.getByText("Cadastrar escolas");
  fireEvent.click(cadastrar);
});

test("Mudar quantidade de escolas por página", async () => {
  const response = await fetch("https://api.aprovaunb.com/api/usuario/login", {
    method: "POST",
  });
  expect(response.status).toEqual(200);
  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    const escolas = screen.getAllByTestId("linha-escola");
    expect(escolas).toHaveLength(3);
  });

  const mudarQuantidade = screen.getByTestId("dropdown-exibir");
  fireEvent.click(mudarQuantidade);

  const mudarQuantidadePara2 = screen.getByTestId("options-2");
  fireEvent.click(mudarQuantidadePara2);

  const avancarPagina = screen.getByTestId("avancar-pagina");
  fireEvent.click(avancarPagina);

  const voltarPagina = screen.getByTestId("voltar-pagina");
  fireEvent.click(voltarPagina);
});

test("Exibir escola selecionada", async () => {
  const response = await fetch("https://api.aprovaunb.com/api/usuario/login", {
    method: "POST",
  });
  expect(response.status).toEqual(200);
  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    const escolas = screen.getAllByTestId("linha-escola");
    expect(escolas).toHaveLength(3);
  });

  const abrirEscolaSelecionada = screen.getByText("Escola A");
  fireEvent.click(abrirEscolaSelecionada);

  const fecharEscolaSelecionada = screen.getByText("Cancelar");
  fireEvent.click(fecharEscolaSelecionada);
});
