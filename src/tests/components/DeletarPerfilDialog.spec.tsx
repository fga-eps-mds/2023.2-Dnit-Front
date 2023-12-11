/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/render-result-naming-convention */
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { DeletarPerfilDialog } from "../../components/DeletarPerfilDialog";
import { MemoryRouter } from "react-router-dom";
import { autenticar } from "../mock/autenticacao";
import { Permissao } from "../../models/auth";
import server from "../mock/servicosAPI";
import { deletePerfil } from "../../service/usuarioApi";

jest.mock("../../service/usuarioApi", () => ({
  ...jest.requireActual("../../service/usuarioApi"),
  deletePerfil: jest.fn(),
}));

const mockedDeletePerfil = deletePerfil as jest.Mock;

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  cleanup();
});

describe("DeletarPerfilDialog", () => {
  test("deve renderizar", () => {
    const screen = render(
      <MemoryRouter>
        <DeletarPerfilDialog
          onClose={() => {}}
          perfil={{ id: "1", nome: "perfil", quantidade: 1 }}
        />
      </MemoryRouter>
    );

    screen.getByText("Tem certeza que deseja excluir esse perfil?");
    screen.getByText("O perfil perfil é usado por 1 usuários.");
    screen.getByText("Cancelar");
    screen.getByText("Confirmar");
  });

  test("deve cancelar", () => {
    autenticar(Permissao.PerfilRemover);
    let deletou = true;

    const screen = render(
      <MemoryRouter>
        <DeletarPerfilDialog
          onClose={(d) => (deletou = d)}
          perfil={{ id: "1", nome: "perfil", quantidade: 1 }}
        />
      </MemoryRouter>
    );

    screen.getByText("Cancelar").click();
    expect(deletou).toBe(false);
  });

  test("deve mostrar carregando", async () => {
    mockedDeletePerfil.mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({ success: true });
          }, 2000);
        })
    );
    autenticar(Permissao.PerfilRemover);
    const screen = render(
      <MemoryRouter>
        <DeletarPerfilDialog
          onClose={() => {}}
          perfil={{ id: "1", nome: "perfil", quantidade: 1 }}
        />
      </MemoryRouter>
    );

    screen.getByText("Confirmar").click();
    await waitFor(() =>
      expect(screen.getByText("Deletando perfil perfil...")).toBeInTheDocument()
    );
  });

  test("deve mostrar notificacão de erro", async () => {
    mockedDeletePerfil.mockRejectedValue(new Error("Erro na requisição"));

    let deletou = false;
    const screen = render(
      <MemoryRouter>
        <DeletarPerfilDialog
          onClose={(d) => (deletou = d)}
          perfil={{ id: "erro", nome: "perfil", quantidade: 1 }}
        />
      </MemoryRouter>
    );

    screen.getByText("Confirmar").click();
    await waitFor(() =>
      expect(
        screen.getByText("Falha na exclusão do perfil.")
      ).toBeInTheDocument()
    );
    expect(deletou).not.toBeTruthy();
  });

  test("deve fechar ao clikar no overlay", async () => {
    const screen = render(
      <MemoryRouter>
        <DeletarPerfilDialog
          onClose={() => {}}
          perfil={{ id: "1", nome: "perfil", quantidade: 1 }}
        />
      </MemoryRouter>
    );

    await waitFor(
      expect(screen.getByText("Tem certeza que deseja excluir esse perfil?"))
        .toBeInTheDocument
    );

    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);
  });
});

test("deve excluir", async () => {
  mockedDeletePerfil.mockResolvedValue({ success: true });
  let deletou = false;
  const screen = render(
    <MemoryRouter>
      <DeletarPerfilDialog
        onClose={(d) => (deletou = d)}
        perfil={{ id: "1", nome: "perfil", quantidade: 1 }}
      />
    </MemoryRouter>
  );

  const confirmar = screen.getByText("Confirmar");
  fireEvent.click(confirmar);
  await waitFor(() =>
    expect(screen.getByText("Deletando perfil perfil...")).toBeInTheDocument()
  );
  await waitFor(() =>
    expect(
      screen.queryAllByText("Perfil deletado com sucesso").length
    ).toBeGreaterThan(0)
  );
  expect(deletou).toBeTruthy();

  mockedDeletePerfil.mockRestore();
});
