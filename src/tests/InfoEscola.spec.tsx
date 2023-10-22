import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../provider/Autenticacao";
import localStorageMock from "./mock/memoriaLocal";
import server from "./mock/servicosAPI";
import { autenticar } from "./mock/autenticacao";
import { Permissao } from "../models/auth";
import { alterarDadosEscolaURL } from "../consts/service";

beforeAll(() => server.listen());
beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Exibir escola selecionada", async () => {
  autenticar(Permissao.EscolaVisualizar);

  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
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

test("Alterar escola selecionada", async () => {
  autenticar(Permissao.EscolaEditar, Permissao.EscolaVisualizar);

  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <AuthProvider>
        <App />
      </AuthProvider>{" "}
    </MemoryRouter>
  );

  await waitFor(() => {
    const escolas = screen.getAllByTestId("linha-escola");
    expect(escolas).toHaveLength(3);
  });

  const abrirEscolaSelecionada = screen.getByText("Escola A");
  fireEvent.click(abrirEscolaSelecionada);

  const telefone = screen.getByLabelText("Telefone");
  fireEvent.change(telefone, { target: { value: "12309876" } });

  const latitude = screen.getByLabelText("Latitude");
  fireEvent.change(latitude, { target: { value: "89" } });

  const longitude = screen.getByLabelText("Longitude");
  fireEvent.change(longitude, { target: { value: "120" } });

  const alunos = screen.getByLabelText("Número total de alunos");
  fireEvent.change(alunos, { target: { value: "120" } });

  const docentes = screen.getByLabelText("Número total de docentes");
  fireEvent.change(docentes, { target: { value: "120" } });

  const obs = screen.getByLabelText("Observação");
  fireEvent.change(obs, { target: { value: "obs" } });

  const etapas = screen.getAllByRole("combobox");
  userEvent.click(etapas[0]);
  await waitFor(() =>
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
  );

  const etapasSelecionada = screen.getByText("Educação Infantil");
  fireEvent.click(etapasSelecionada);

  const alterarSituacao = screen.getByTestId("dropdown-situacao");
  fireEvent.click(alterarSituacao);

  const selecionarSituacao = await screen.findByText("Indicação");
  fireEvent.click(selecionarSituacao);

  const salvarEscolaSelecionada = screen.getByText("Salvar");
  fireEvent.click(salvarEscolaSelecionada);
});

test("Alterar escola selecionada erro", async () => {
  autenticar(Permissao.EscolaEditar, Permissao.EscolaVisualizar);

  server.use(
    rest.put(
      alterarDadosEscolaURL,
      (req, res, ctx) => {
        return res(ctx.status(400));
      }
    )
  );
  render(
    <MemoryRouter initialEntries={["/escolas-cadastradas"]}>
      <AuthProvider>
        <App />
      </AuthProvider>{" "}
    </MemoryRouter>
  );

  await waitFor(() => {
    const escolas = screen.getAllByTestId("linha-escola");
    expect(escolas).toHaveLength(3);
  });

  const abrirEscolaSelecionada = screen.getByText("Escola A");
  fireEvent.click(abrirEscolaSelecionada);

  const telefone = screen.getByLabelText("Telefone");
  fireEvent.change(telefone, { target: { value: "12309876" } });

  const latitude = screen.getByLabelText("Latitude");
  fireEvent.change(latitude, { target: { value: "89" } });

  const longitude = screen.getByLabelText("Longitude");
  fireEvent.change(longitude, { target: { value: "120" } });

  const alunos = screen.getByLabelText("Número total de alunos");
  fireEvent.change(alunos, { target: { value: "120" } });

  const docentes = screen.getByLabelText("Número total de docentes");
  fireEvent.change(docentes, { target: { value: "120" } });

  const salvarEscolaSelecionada = screen.getByText("Salvar");
  fireEvent.click(salvarEscolaSelecionada);
});
