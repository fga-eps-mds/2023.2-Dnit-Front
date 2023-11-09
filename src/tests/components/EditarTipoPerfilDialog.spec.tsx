/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { EditarTipoPerfilDialog } from "../../components/EditarTipoPerfilDialog";
import server from "../mock/servicosAPI";
import { MemoryRouter } from "react-router-dom";
import { usuarios } from "../stub/usuarioModelos";

beforeAll(() => {
  server.listen();  
});

afterEach(() => {
  cleanup();
});

const itemsPerfisTest = [{ id: "0", rotulo: "perfil0" }, { id: "1", rotulo: "perfil1" }, { id: "2", rotulo: "perfil2" }];
const itemsUfTest = [{id: "0", rotulo: "uf0"}, {id: "1", rotulo: "uf1"}, {id: "2", rotulo: "uf2"}]
const usuarioSelecionado = "0";
const tipoPerfilSelecionado = "perfil0"
const ufSelecionada = "uf0"

describe("Testes para o componente EditarTipoPerfilDialog", () => {

  it("Deve renderizar o EditarTipoPerfilDialog Corretamente", () => {
    const screen = render(
      <EditarTipoPerfilDialog
        listaOpcoes={itemsPerfisTest}
        listaOpcoesUfs={itemsUfTest}
        listaUsuarios={usuarios}
        usuarioId={usuarioSelecionado}
        perfilAntesAlteracao={tipoPerfilSelecionado}
        ufAntesAlteracao={ufSelecionada}
        closeDialog={() => { }}
        atualizaTabela={() => { }}
      />
    )

    expect(screen.getByText("Tipo Perfil")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();

  });

  it("Deve cancelar o EditarTipoPerfilDialog Corretamente", () => {
    let deletou = true;

    const screen = render(
      <MemoryRouter>
        <EditarTipoPerfilDialog
          listaOpcoes={itemsPerfisTest}
          listaOpcoesUfs={itemsUfTest}
          listaUsuarios={usuarios}
          usuarioId={usuarioSelecionado}
          perfilAntesAlteracao={tipoPerfilSelecionado}
          ufAntesAlteracao={ufSelecionada}
          closeDialog={d => deletou = d}
          atualizaTabela={() => { }}
        />
      </MemoryRouter>
    )

    const buttom = screen.getByTestId("botaoCancelar");
    fireEvent.click(buttom);

    expect(deletou).toBe(false);

  });

  it("Deve confirmar o tipo do Perfil corretamente", async () => {
    const screen = render(
      <MemoryRouter>
        <EditarTipoPerfilDialog
          listaOpcoes={itemsPerfisTest}
          listaOpcoesUfs={itemsUfTest}
          listaUsuarios={usuarios}
          usuarioId={usuarioSelecionado}
          perfilAntesAlteracao={tipoPerfilSelecionado}
          ufAntesAlteracao={ufSelecionada}
          closeDialog={() => {}}
          atualizaTabela={() => { }}
        />
      </MemoryRouter>
    )

    const botao = screen.getByTestId("PerfilcustomSelect");
    fireEvent.click(botao);

    const opcao = screen.getByText("perfil0");
    fireEvent.click(opcao); 

    const buttom = screen.getByTestId("botaoConfirmar");
    fireEvent.click(buttom);

    await waitFor(() => expect(screen.queryAllByText('O perfil foi alterado com sucesso!').length).toBeGreaterThan(0));
    
  });

  it("Deve tentar alterar perfil sem selecionar opção", async () => {
    const screen = render(
      <MemoryRouter>
        <EditarTipoPerfilDialog
          listaOpcoes={itemsPerfisTest}
          listaOpcoesUfs={itemsUfTest}
          listaUsuarios={usuarios}
          usuarioId={usuarioSelecionado}
          perfilAntesAlteracao={tipoPerfilSelecionado}
          ufAntesAlteracao={ufSelecionada}
          closeDialog={() => {}}
          atualizaTabela={() => { }}
        />
      </MemoryRouter>
    )

    const buttom = screen.getByTestId("botaoConfirmar");
    fireEvent.click(buttom);

    await waitFor(() => expect(screen.queryAllByText('Selecione um tipo de perfil').length).toBeGreaterThan(0));
    
  });
  
  it("Deve fechar o EditarTipoPerfilDialog Corretamente", () => {
    let deletou = true;

    const screen = render(
      <MemoryRouter>
        <EditarTipoPerfilDialog
          listaOpcoes={itemsPerfisTest}
          listaOpcoesUfs={itemsUfTest}
          listaUsuarios={usuarios}
          usuarioId={usuarioSelecionado}
          perfilAntesAlteracao={tipoPerfilSelecionado}
          ufAntesAlteracao={ufSelecionada}
          closeDialog={d => deletou = d}
          atualizaTabela={() => { }}
        />
      </MemoryRouter>
    )

    const buttom = screen.getByTestId("botaoFechar");
    fireEvent.click(buttom);

    expect(deletou).toBe(false);

  });

  it("Deve confirmar as UFs corretamente", async () => {
    const screen = render(
      <MemoryRouter>
        <EditarTipoPerfilDialog
          listaOpcoes={itemsPerfisTest}
          listaOpcoesUfs={itemsUfTest}
          listaUsuarios={usuarios}
          usuarioId={usuarioSelecionado}
          perfilAntesAlteracao={tipoPerfilSelecionado}
          ufAntesAlteracao={ufSelecionada}
          closeDialog={() => {}}
          atualizaTabela={() => { }}
        />
      </MemoryRouter>
    )

    const botao = screen.getByTestId("UFcustomSelect");
    fireEvent.click(botao);

    const opcao = screen.getByText("uf0");
    fireEvent.click(opcao); 

    const buttom = screen.getByTestId("botaoConfirmar");
    fireEvent.click(buttom);

    await waitFor(() => expect(screen.queryAllByText('O perfil foi alterado com sucesso!').length).toBeGreaterThan(0));
    
  });

});