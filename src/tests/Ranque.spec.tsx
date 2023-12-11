import { findAllByText, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import server from "./mock/servicosAPI";
import { Permissao } from "../models/auth";
import { autenticar } from "./mock/autenticacao";
import Ranque from "../pages/Ranque";
import { wait } from "@testing-library/user-event/dist/utils";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


describe('TabelaRanque', () => {
  it("Deve renderizar a pagina de Tabela Ranque", async () => {
    autenticar(Permissao.RanqueVisualizar)
    render(
      <MemoryRouter>
        <AuthProvider>
          <Ranque />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("UF:")).toBeInTheDocument();
    expect(screen.getByText("Municípios:")).toBeInTheDocument();
    expect(screen.getByText("Etapas de Ensino:")).toBeInTheDocument();
  });

  it("Deve filtrar a escola", async () => {
    autenticar(Permissao.RanqueVisualizar);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Ranque />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("filtroNome"), { target: { value: "escola 5" } });
    expect(screen.getByTestId("filtroNome")).toHaveValue("escola 5");

    screen.getByTestId('UF:customSelect').click();
    await waitFor(() => expect(screen.getByTestId('UF:1')).toBeInTheDocument());
    screen.getByTestId('UF:1').click();

    screen.getByTestId('Municípios:customSelect').click();
    await waitFor(() => expect(screen.getByTestId('Municípios:1')).toBeInTheDocument());
    screen.getByTestId('Municípios:1').click();

    screen.getByTestId('Etapas de Ensino:customSelect').click();
    await waitFor(() => expect(screen.getByTestId('Etapas de Ensino:1')).toBeInTheDocument());
    screen.getByTestId('Etapas de Ensino:1').click();

    expect(screen.getByTestId("filtroNome")).toHaveValue("escola 5");
    await waitFor(() => expect(screen.getByText('escola 5')).toBeInTheDocument());
  })

  it("Deve paginar o ranqueamento", async () => {
    autenticar(Permissao.RanqueVisualizar);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Ranque />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('escola 5')).toBeInTheDocument());

    await waitFor(() => expect(screen.getByTestId('proxima-pagina')).toBeInTheDocument());
    screen.getByTestId('proxima-pagina').click();

    await waitFor(() => expect(screen.getByTestId('volta-pagina')).toBeInTheDocument());
    screen.getByTestId('volta-pagina').click();

    fireEvent.change(screen.getByTestId("drop-select-page"), { target: { value: 2 } });

    fireEvent.change(screen.getByTestId("items-per-page"), { target: { value: 2 } });

    await waitFor(() => expect(screen.getByText('escola 5')).toBeInTheDocument());
  })

  it("Deve abrir os detalhes da escola", async () => {
    autenticar(Permissao.RanqueVisualizar);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Ranque />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('escola 5')).toBeInTheDocument());

    screen.getByTestId('table-row-eye-3').click();

    await waitFor(() => expect(screen.getByText('Carregando Escola...')).toBeInTheDocument());
  })

  it("Deve abrir um pagina do google maps", async () => {
    autenticar(Permissao.RanqueVisualizar);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Ranque />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('escola 5')).toBeInTheDocument());

    screen.getByTestId('table-row-location-3').click();

  })

  it("Deve gerar errao ao tentar abrir um pagina do google maps", async () => {
    autenticar(Permissao.RanqueVisualizar);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Ranque />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('escola 4')).toBeInTheDocument());

    screen.getByTestId('table-row-location-2').click();

    await waitFor(() => expect(screen.findAllByText("Não foi possível encontrar essa localização")).toBeInTheDocument);

  })
})
