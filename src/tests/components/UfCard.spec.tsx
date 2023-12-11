import { fireEvent, render, waitFor } from "@testing-library/react";
import SelectCardGroup from "../../components/SelectCardGroup";
import UfCardGroup from "../../components/UfCard";


afterEach(jest.clearAllMocks);

const cardsTest = [{  uf: "27", quantidadeEscolasTotal: 1 }, {  uf: "1", quantidadeEscolasTotal: 12 }];

describe("Testes para o componente UfCard", () => {
    test("Deve renderizar o componente UF Card Group", () => {
        const screen = render(
            <UfCardGroup
                cardsData={cardsTest}
            />
        )

        expect(screen.getByText("1 Escola")).toBeInTheDocument();
        expect(screen.getByText("12 Escolas")).toBeInTheDocument();
    })


})