/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { render, fireEvent, waitFor, cleanup, prettyDOM } from "@testing-library/react";
import server from "./mock/servicosAPI";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../provider/Autenticacao";
import { autenticar } from "./mock/autenticacao";
import { Permissao } from "../models/auth";
import GerenciarSolicitacoes from "../pages/gerencia/GerenciarSolicitacoes";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Testes para a pagina de Solicitacoes', () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    test('Deve renderizar a pagina', async () => { 
    const screen = render(
      <MemoryRouter>
        <AuthProvider>
        <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Escola')).toBeInTheDocument();
    expect(screen.getByText('Qtd. Alunos:')).toBeInTheDocument();
    expect(screen.getByText('UF:')).toBeInTheDocument();
    expect(screen.getByText('Municipios:')).toBeInTheDocument();
  });

  test('Deve filtrar por escola', async () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByTestId("filtroEscola"), { target: { value: "Escola A" } });
    expect(screen.getByTestId("filtroEscola")).toHaveValue("Escola A");
    expect((await screen.findAllByText("Escola A")).length).toBe(1);
  });

  test('Deve filtrar por qtd alunos', async () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText("Soliciatações de Ações"));

    const qtdAlunos = screen.getByTestId("Qtd. Alunos:customSelect");

    await fireEvent.click(qtdAlunos);
    fireEvent.click(screen.getByText('Até 50'));
    
    await fireEvent.click(qtdAlunos);
    fireEvent.click(screen.getByText('Entre 51 e 200'));

    await fireEvent.click(qtdAlunos);
    fireEvent.click(screen.getByText('Entre 201 e 500'));

    await fireEvent.click(qtdAlunos);
    fireEvent.click(screen.getByText('Entre 501 e 1000'));

    await fireEvent.click(qtdAlunos);
    fireEvent.click(screen.getByText('Mais que 1001'));
    
    await fireEvent.click(qtdAlunos);
    fireEvent.click(screen.getByText('Todos'));

    await waitFor(() => expect(screen.findAllByText('Escola A')).toBeInTheDocument);

  });

  test('Deve utilizar o filtro de UF e municipio', async () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Soliciatações de Ações"));

    const tamanhoPaginaSelector = screen.getByTestId('items-per-page');
    fireEvent.change(tamanhoPaginaSelector, { target: { value: '1' } });

    const listaUFs = screen.getByTestId("UF:customSelect")
    await fireEvent.click(listaUFs);

    const ufOption = await screen.findAllByText("AC");
    const ufValue = ufOption[0]; 
    fireEvent.click(ufValue);

    const listaMunicipios = screen.getByTestId("Municipios:customSelect")
    await fireEvent.click(listaMunicipios);
    
    const municipioOption = await screen.findAllByText("Acrelândia");
    const municipioValue = municipioOption[0]; 
    fireEvent.click(municipioValue);

    await waitFor(() => expect(screen.findAllByText('Escola A')).toBeInTheDocument);

  });

  test('Deve utilizar o filtro de Municipio', async () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Soliciatações de Ações"));

    const tamanhoPaginaSelector = screen.getByTestId('items-per-page');
    fireEvent.change(tamanhoPaginaSelector, { target: { value: '1' } });
  });

  test('Deve selecionar uma das paginas', async () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Soliciatações de Ações"));

    const tamanhoPaginaSelector = screen.getByTestId('items-per-page');
    fireEvent.change(tamanhoPaginaSelector, { target: { value: '1' } });

    await waitFor(() => screen.getByText('Escola A'));
    const buttonNext = screen.getByTestId("proxima-pagina");
    fireEvent.click(buttonNext);

    await fireEvent.click(buttonNext);

    await fireEvent.click(buttonNext);

    const buttonPrevious = screen.getByTestId("volta-pagina");
    fireEvent.click(buttonPrevious);

    await fireEvent.click(buttonPrevious);

    await fireEvent.click(buttonPrevious);

    const paginaSelectorDropdown = screen.getByTestId('drop-select-page');
    fireEvent.change(paginaSelectorDropdown, { target: { value: '2' } });

    await waitFor(() => expect(screen.getByText("Escola:")).toBeInTheDocument());

  });

  test('Deve clickar no botao de visualisar', async () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Soliciatações de Ações"));

    const tamanhoPaginaSelector = screen.getByTestId('items-per-page');
    fireEvent.change(tamanhoPaginaSelector, { target: { value: '1' } });

    await waitFor(() => screen.getByText('Escola A'));

    await waitFor(() => fireEvent.click(screen.getByTestId('table-row-eye-0')));

    await waitFor(expect(screen.getByText('Detalhes da Solicitação')).toBeInTheDocument);

    const botaoFechar = screen.getByTestId('botaoFechar');
    fireEvent.click(botaoFechar);

  });

  test.skip('Deve clickar no botao de criar escola', async () => {
    autenticar(Permissao.SolicitacaoVisualizar, Permissao.EscolaCadastrar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Soliciatações de Ações"));

    const tamanhoPaginaSelector = screen.getByTestId('items-per-page');
    fireEvent.change(tamanhoPaginaSelector, { target: { value: '1' } });

    const buttonNext = screen.getByTestId("proxima-pagina");
    await fireEvent.click(buttonNext);

    await waitFor(() => expect(screen.getByText('Outra Escola')).toBeInTheDocument);
    

    await waitFor(() => fireEvent.click(screen.getByTestId('table-row-plus-0')));
    

    await waitFor(expect(screen.getByText('Cadastrar Escola')).toBeInTheDocument);

    const botaoFechar = screen.getByTestId('botaoCancelar');
    fireEvent.click(botaoFechar);

  });
  test.skip('Deve nao usar o botao de criar escola sem permissão', async () => {
    autenticar(Permissao.SolicitacaoVisualizar);

    const screen = render(
      <MemoryRouter>
        <AuthProvider>
          <GerenciarSolicitacoes />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Soliciatações de Ações"));

    const tamanhoPaginaSelector = screen.getByTestId('items-per-page');
    fireEvent.change(tamanhoPaginaSelector, { target: { value: '1' } });

    const buttonNext = screen.getByTestId("proxima-pagina");
    await fireEvent.click(buttonNext);

    await waitFor(() => expect(screen.getByText('Outra Escola')).toBeInTheDocument());
    

    await waitFor(() => expect(screen.getByTestId('table-row-plus-0')).not.toBeInTheDocument());

  });


})