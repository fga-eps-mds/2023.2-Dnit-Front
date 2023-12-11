import { MemoryRouter } from "react-router-dom";
import FatorForm from "../../components/FatorForm";
import server from "../mock/servicosAPI";
import { render } from "@testing-library/react";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const FatorTeste = 
{
    nome: "string",
    peso: 0,
    ativo: true,
    primario: false,
    fatorCondicoes: [
      {
        propriedade: "4",
        operador: "1",
        valores: [
          "27"
        ],
      }
    ]
  }

describe("Testes para componente FatorForm", () => {
    it("Deve renderizar o componente", () => {
        const screen = render(
            <MemoryRouter>
                <FatorForm fator={FatorTeste} onSaveFator={(f) => {}}></FatorForm>
            </MemoryRouter>
        )

        // expect(screen.getByText("string")).toBeInTheDocument();
        // expect(screen.getByText("Cancelar")).toBeInTheDocument();
        // expect(screen.getByText("Salvar")).toBeInTheDocument();
    })
}) 
