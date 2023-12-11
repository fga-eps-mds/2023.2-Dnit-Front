import { fireEvent, render, waitFor } from "@testing-library/react";
import SelectCardGroup from "../../components/SelectCardGroup";
import UfCardGroup from "../../components/UfCard";
import SelectSchoolCard from "../../components/SelectSchoolCard";


afterEach(jest.clearAllMocks);
const nomeEscola = "Escolinha Azul"
const uf = "27"

describe("Testes para o componente SelectSchoolCard", () => {
    test("Deve renderizar o componente", () => {
        const screen = render(
            <SelectSchoolCard
                schoolId={1}
                schoolName={nomeEscola}
                schoolStudents={10}
                schoolUf={uf}
                onClick={() => { }}
            />
        )

        expect(screen.getByText("Nome: Escolinha Azul")).toBeInTheDocument();
    })
    test("Deve renderizar o componente", () => {
    const onCardClickMock = jest.fn();

        const screen = render(
            <SelectSchoolCard
                schoolId={1}
                schoolName={nomeEscola}
                schoolStudents={10}
                schoolUf={uf}
                onClick={onCardClickMock}
            />
        )

        const card = screen.getByText("Nome: Escolinha Azul");
        fireEvent.click(card);

        expect(onCardClickMock).toHaveBeenCalled();
    })

})